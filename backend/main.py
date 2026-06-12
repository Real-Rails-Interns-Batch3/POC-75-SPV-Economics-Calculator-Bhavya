import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SPV Economics Ledger Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dynamically pull from the synthetic package path
DATA_PATH = os.path.join(os.path.dirname(__file__), "../mock-data/spv_synthetic_data.json")

@app.get("/api/v1/spv-assets")
def get_synthetic_assets():
    if not os.path.exists(DATA_PATH):
        return {"error": "Synthetic mock-data package payload missing"}
        
    with open(DATA_PATH, "r") as file:
        data = json.load(file)
        
    # Combines rows and edge cases into a single feed with synthetic metadata headers attached
    all_records = data["SAMPLE_ROWS"] + data["EDGE_CASES_AND_ERROR_STATES"]
    return {
        "metadata": data["METADATA"],
        "records": all_records
    }