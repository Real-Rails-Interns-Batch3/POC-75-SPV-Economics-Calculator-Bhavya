import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io

app = FastAPI(title="SPV Economics Data Engine API")

# Setup CORS to speak with your local frontend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/sec-feed")
async def get_sec_feed():
    # Utilizing environmental configurations matching requirements blueprints
    sec_key = os.getenv("SEC_API_KEY", "mock_default_pipeline_key")
    return {
        "Stripe Enterprise Core": {
            "source": "SEC EDGAR Form D Ingestion API",
            "fundraisingGoal": 3000000,
            "managementFee": 2.0,
            "performanceCarry": 20,
            "exitMultiple": 3.2,
            "description": "Production scale automated syndicate tracking pipeline matching ticker asset."
        },
        "SpaceX Late Stage Secondary": {
            "source": "Synthetic SEC Placement Record",
            "fundraisingGoal": 5000000,
            "managementFee": 1.75,
            "performanceCarry": 25,
            "exitMultiple": 4.5,
            "description": "Aggregated programmatic funding round profile tracker."
        }
    }

@app.get("/api/v1/download-sample")
async def download_sample():
    csv_data = "asset_name,fundraising_goal,management_fee,performance_carry,exit_multiple\nStripe Enterprise Core,3000000,2.0,20,3.2\nSpaceX Late Stage Secondary,5000000,1.75,25,4.5"
    output = io.StringIO()
    output.write(csv_data)
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=spv_sample_analytics_profiles.csv"}
    )