from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI(title="SPV Economics Core Engine Pipeline")

# Enable CORS Handshake so Next.js on port 3000 can ingest telemetry streams
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reusable Data Adapter Structure mimicking SEC EDGAR Form D Filings
SEC_EDGAR_DATAPOOL = {
    "SpaceX Tier-1 Secondary": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "fundraisingGoal": 3500000, "managementFee": 1.75, "performanceCarry": 15, "exitMultiple": 2.79,
        "description": "Form D filed tracking regional asset node pooling limits for scale secondary allocations."
    },
    "Stripe Enterprise Core": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "fundraisingGoal": 2500000, "managementFee": 2.00, "performanceCarry": 20, "exitMultiple": 2.75,
        "description": "Form D validation ledger routing corporate liquidity frameworks for digital commerce rails."
    },
    "Anthropic Seed Allocation": {
        "source": "SEC EDGAR Form D Ingest (SYNTHETIC_MOCK)",
        "fundraisingGoal": 1500000, "managementFee": 2.50, "performanceCarry": 25, "exitMultiple": 2.88,
        "description": "Form D issuance documenting initial core computational allocation access channels."
    }
}

@app.get("/api/v1/sec-feed")
def get_sec_feed():
    return SEC_EDGAR_DATAPOOL

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