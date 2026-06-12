import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SPV Economics Calculator Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "../mock-data/spv_synthetic_data.json")

def read_synthetic_package():
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail="Synthetic mock-data package missing.")
    with open(DATA_PATH, "r") as f:
        return json.load(f)

@app.get("/api/v1/spv-assets")
def get_assets():
    return read_synthetic_package()

# 📥 DOWNLOADABLE SAMPLE DATA ENDPOINT (Generates CSV on the fly)
@app.get("/api/v1/download-csv")
def download_csv():
    data = read_synthetic_package()
    csv_content = "ID,Name,Total_Capital,Mgmt_Fee,Carry,SEC_CIK,SEC_Form,Status,Controller,Revenue,Expenses\n"
    for row in data["SAMPLE_ROWS"]:
        csv_content += f"{row['id']},{row['name']},{row['totalCapital']},{row['mgmtFee']},{row['carry']},{row['edgarCik']},{row['secForm']},{row['status']},{row['controller']},{row['revenue']},{row['expenses']}\n"
    
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=synthetic_spv_ledger_export.csv"}
    )