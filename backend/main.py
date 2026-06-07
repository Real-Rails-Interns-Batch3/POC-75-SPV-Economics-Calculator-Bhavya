from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI(title="SPV Economics Core Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEC_SYNTHETIC_DATAPOOL = {
    "SpaceX Tier-1 Secondary": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "baseGoal": 3500000, "defaultFee": 1.75, "defaultCarry": 15, "defaultMultiple": 2.79, "roi": "2.79x ROI"
    },
    "Stripe Enterprise Core": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "baseGoal": 2500000, "defaultFee": 2.00, "defaultCarry": 20, "defaultMultiple": 2.75, "roi": "2.18x ROI"
    },
    "Anthropic Seed Allocation": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "baseGoal": 1500000, "defaultFee": 2.50, "defaultCarry": 25, "defaultMultiple": 2.88, "roi": "2.88x ROI"
    }
}

@app.get("/api/v1/sec-feed")
def get_sec_feed():
    return SEC_SYNTHETIC_DATAPOOL

@app.get("/api/v1/download-sample")
def download_sample():
    csv_data = [
        {"Asset Node": "SpaceX Tier-1 Secondary", "Fundraising Goal": 3500000, "Annual Fee %": 1.75, "Carry %": 15, "Exit Multiple": 2.79, "Data Classification": "SYNTHETIC_SEC_EDGAR_DATA"},
        {"Asset Node": "Stripe Enterprise Core", "Fundraising Goal": 2500000, "Annual Fee %": 2.00, "Carry %": 20, "Exit Multiple": 2.75, "Data Classification": "SYNTHETIC_SEC_EDGAR_DATA"},
        {"Asset Node": "Anthropic Seed Allocation", "Fundraising Goal": 1500000, "Annual Fee %": 2.50, "Carry %": 25, "Exit Multiple": 2.88, "Data Classification": "SYNTHETIC_SEC_EDGAR_DATA"}
    ]
    df = pd.DataFrame(csv_data)
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    response = StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=synthetic_spv_sample_data.csv"
    return response
