from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os

app = FastAPI(title="SPV Capital Ledger Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DealCalculationRequest(BaseModel):
    total_raised: float
    mgmt_fee_pct: float
    years: int
    carry_pct: float
    exit_multiple: float

@app.get("/")
async def serve_dashboard():
    return FileResponse(os.path.join(os.path.dirname(__file__), "index.html"))

@app.post("/api/calculate-spv")
async def calculate_spv_waterfall(payload: DealCalculationRequest):
    # Total administrative overhead accumulated across deal lifespan
    total_fees = payload.total_raised * (payload.mgmt_fee_pct / 100) * payload.years
    deployed_capital = max(0.0, payload.total_raised - total_fees)
    
    # Value generation at exit liquidity event
    total_exit_proceeds = deployed_capital * payload.exit_multiple
    
    # Standard linear waterfall processing rules
    investor_principal_payback = min(total_exit_proceeds, payload.total_raised)
    remaining_profit = max(0.0, total_exit_proceeds - investor_principal_payback)
    
    # Performance incentive distribution splits
    manager_carry_profit = remaining_profit * (payload.carry_pct / 100)
    investor_remaining_profit = remaining_profit * (1 - (payload.carry_pct / 100))
    
    manager_fees_plus_carry = total_fees + manager_carry_profit
    total_investor_payout = investor_principal_payback + investor_remaining_profit
    
    net_investor_multiple = round(total_investor_payout / payload.total_raised, 2) if payload.total_raised > 0 else 0.0
    
    return {
        "gross_exit_proceeds": round(total_exit_proceeds, 2),
        "net_investor_payout": round(total_investor_payout, 2),
        "net_investor_multiple": net_investor_multiple,
        "initial_principal_payback": round(investor_principal_payback, 2),
        "net_investor_profits": round(investor_remaining_profit, 2),
        "manager_fees_plus_carry": round(manager_fees_plus_carry, 2),
        "deployed_capital": round(deployed_capital, 2)
    }