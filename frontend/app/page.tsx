"use client";

import React, { useState } from 'react';

export default function Page() {
  const [activeAsset, setActiveAsset] = useState("Stripe Enterprise Core");
  const [fundraisingGoal, setFundraisingGoal] = useState(2500000);
  const [annualFee, setAnnualFee] = useState(2.00);
  const [performanceCarry, setPerformanceCarry] = useState(20);
  const [exitMultiple, setExitMultiple] = useState(2.75);

  const assetLedger: Record<string, { source: string; baseGoal: number; defaultFee: number; defaultCarry: number; defaultMultiple: number; roi: string }> = {
    "SpaceX Tier-1 Secondary": { source: "SEC EDGAR Form D (SYNTHETIC LABELS)", baseGoal: 3500000, defaultFee: 1.75, defaultCarry: 15, defaultMultiple: 2.79, roi: "2.79x ROI" },
    "Stripe Enterprise Core": { source: "SEC EDGAR Form D (SYNTHETIC LABELS)", baseGoal: 2500000, defaultFee: 2.00, defaultCarry: 20, defaultMultiple: 2.75, roi: "2.18x ROI" },
    "Anthropic Seed Allocation": { source: "SEC EDGAR Form D (SYNTHETIC LABELS)", baseGoal: 1500000, defaultFee: 2.50, defaultCarry: 25, defaultMultiple: 2.88, roi: "2.88x ROI" }
  };

  const handleAssetHandshake = (assetName: string) => {
    setActiveAsset(assetName);
    const targetData = assetLedger[assetName];
    setFundraisingGoal(targetData.baseGoal);
    setAnnualFee(targetData.defaultFee);
    setPerformanceCarry(targetData.defaultCarry);
    setExitMultiple(targetData.defaultMultiple);
  };

  // Mathematical Calculation Engine Cascades
  const grossProceeds = fundraisingGoal * exitMultiple;
  const totalFeesAndCarry = grossProceeds * ((annualFee / 100) + (performanceCarry / 100));
  const netToInvestors = grossProceeds - totalFeesAndCarry;
  const dealMultiple = (netToInvestors / fundraisingGoal).toFixed(2);
  const investorProfits = Math.max(0, netToInvestors - fundraisingGoal);

  // FEATURE: Programmatic Break-Even Multiple calculation
  const totalFeeSlices = (annualFee / 100) + (performanceCarry / 100);
  const breakEvenMultiple = totalFeeSlices >= 1 ? "N/A" : (1 / (1 - totalFeeSlices)).toFixed(2);

  // FEATURE: Export Memo Summary Action Code Block
  const exportMemoSummary = () => {
    const briefText = `=== SPV INVESTMENT ECONOMIC MEMO ===\nAsset Identification: ${activeAsset}\nData Integrity Ingest: ${assetLedger[activeAsset].source}\nFundraising Target: $${fundraisingGoal.toLocaleString()}\nGross Exit Evaluation: $${grossProceeds.toLocaleString()}\nNet Distributed to LPs: $${netToInvestors.toLocaleString()}\nNet Exit Multiple Yield: ${dealMultiple}x\nBreak-Even Asset Threshold: ${breakEvenMultiple}x\n===================================`;
    const element = document.createElement("a");
    const fileBlob = new Blob([briefText], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${activeAsset.toLowerCase().replace(/ /g, "_")}_investment_memo.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-300 font-mono p-4 md:p-8 block overflow-y-visible">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 pb-24">
        
        {/* ACTION CONTROL HEADER BAR */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 gap-4">
          <div>
            <div className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">// SEC EDGAR ANALYTICAL TERMINAL</div>
            <h1 className="text-xl font-black text-white tracking-wider uppercase mt-0.5">SPV Economics Calculator</h1>
          </div>
          <div className="flex gap-3">
            {/* FEATURE: Downloadable Sample Data linking to local FastAPI server */}
            <a 
              href="http://localhost:8000/api/v1/download-sample"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold bg-slate-900 border border-slate-800 hover:border-purple-500 text-slate-300 px-3 py-2 rounded transition-all cursor-pointer"
            >
              📥 Download Sample Data
            </a>
            {/* FEATURE: Export Memo Summary */}
            <button 
              onClick={exportMemoSummary}
              className="text-[11px] font-bold bg-purple-950/40 border border-purple-500 text-white px-3 py-2 rounded hover:bg-purple-900/60 transition-all cursor-pointer"
            >
              📋 Export Memo Summary
            </button>
          </div>
        </header>

        {/* 70/30 DATA ARCHITECTURE LAYOUT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          
          {/* 70% WORKSPACE REGION (7 Columns out of 10) */}
          <main className="lg:col-span-7 flex flex-col gap-8 w-full">
            
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Asset Liquidation Waterfall</h2>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">Audit: <span className="text-purple-400 font-mono font-bold">{assetLedger[activeAsset].source}</span></p>
                </div>

                {/* FEATURE: Break-Even View Component with Integrated Micro-Tooltip */}
                <div className="text-right bg-slate-950 px-3 py-1.5 rounded border border-slate-900 relative group cursor-help">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Break-Even Multiple</div>
                  <div className="text-sm font-black text-amber-400">{breakEvenMultiple}x</div>
                  
                  {/* Tooltip Content layer */}
                  <span className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl font-sans normal-case leading-normal z-50">
                    The gross growth multiple the underlying startup must achieve to cover management fees and return exactly 100% of capital back to LPs.
                  </span>
                </div>
              </div>

              {/* KPI TELEMETRY GRID WITH HOVER TOOLTIPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#050811] border border-slate-900 rounded p-4 relative group cursor-help">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Gross Portfolio Exit</div>
                  <div className="text-xl font-black text-white mt-1">${grossProceeds.toLocaleString()}</div>
                  <span className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans z-50 normal-case">
                    Total acquisition payout value before carry/fee deductions.
                  </span>
                </div>
                
                <div className="bg-[#050811] border border-emerald-950 rounded p-4 relative group cursor-help">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Net Cash Distributed LPs</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">${netToInvestors.toLocaleString()}</div>
                  <span className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans z-50 normal-case">
                    Net capital systematically wired back to investors.
                  </span>
                </div>

                <div className="bg-[#050811] border border-cyan-950 rounded p-4 relative group cursor-help">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Net Deal Return Multiple</div>
                  <div className="text-xl font-black text-cyan-400 mt-1">{dealMultiple}x</div>
                  <span className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans z-50 normal-case">
                    Final clear ROI multiplier received by Limited Partners.
                  </span>
                </div>
              </div>

              {/* HORIZONTAL RENDERING APPORTIONMENT GRAPH SPLIT */}
              <div className="p-4 bg-[#050811] border border-slate-900 rounded flex flex-col justify-center min-h-[120px]">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-4">// ASSET YIELD CAPITAL DISTRIBUTION SPLIT [SYNTHETIC DATA LABELS]</div>
                <div className="w-full bg-slate-950 h-5 rounded overflow-hidden flex border border-slate-900">
                  <div style={{ width: `${Math.min(100, (fundraisingGoal / grossProceeds) * 100)}%` }} className="h-full bg-slate-700" />
                  <div style={{ width: `${Math.max(0, (investorProfits / grossProceeds) * 100)}%` }} className="h-full bg-emerald-500" />
                  <div style={{ width: `${Math.min(100, (totalFeesAndCarry / grossProceeds) * 100)}%` }} className="h-full bg-cyan-500" />
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-[9px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 bg-slate-700 rounded-full" /> Principal Return</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Net LP Profits</span>
                  <span className="flex items-center gap-1.5 text-cyan-400"><span className="w-2 h-2 bg-cyan-500 rounded-full" /> Fees & Carry Pool</span>
                </div>
              </div>
            </div>

            {/* LEDGER DATA LIST SUMMARY */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-6 shadow-xl">
              <div className="text-[10px] text-purple-500 font-bold tracking-widest uppercase mb-4">// WATERFALL ACCOUNTING DISTRIBUTION LEDGER</div>
              <div className="divide-y divide-slate-900 text-xs font-bold space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-normal">Effective Capital Deployed (Synthetic)</span>
                  <span className="text-white">${fundraisingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Initial Principal Payback Pool</span>
                  <span className="text-white">${fundraisingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Net Profit Allocation Pool</span>
                  <span className="text-emerald-400">${investorProfits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Manager Aggregate Carry Overhead</span>
                  <span className="text-cyan-400">${totalFeesAndCarry.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </main>

          {/* 30% CONTROL SIDEBAR (3 Columns out of 10) */}
          <aside className="lg:col-span-3 flex flex-col gap-6 w-full">
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-4 shadow-xl flex flex-col gap-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Private Asset Ledgers (SEC)</div>
              {Object.keys(assetLedger).map((assetName) => (
                <button
                  key={assetName}
                  onClick={() => handleAssetHandshake(assetName)}
                  className={`w-full p-3 text-left rounded border transition-all text-xs font-bold flex justify-between items-center cursor-pointer ${
                    activeAsset === assetName
                      ? 'bg-purple-950/20 text-white border-purple-500'
                      : 'bg-[#050811] text-slate-400 border-slate-900/60 hover:border-slate-800'
                  }`}
                >
                  <span className="truncate pr-2">{assetName}</span>
                  <span className="text-emerald-400 font-sans text-[11px] shrink-0">{assetLedger[assetName].roi}</span>
                </button>
              ))}
            </div>

            {/* TUNING PARAMETER SLIDERS */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-4 shadow-xl space-y-5">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">// VARIABLE TUNING NODES</div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Fundraising Goal</span>
                  <span className="text-purple-400">${fundraisingGoal.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="1000000" max="10000000" step="100000"
                  value={fundraisingGoal} onChange={(e) => setFundraisingGoal(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Annual Fee %</span>
                  <span className="text-purple-400">{annualFee.toFixed(2)}%</span>
                </div>
                <input 
                  type="range" min="0.5" max="5.0" step="0.25"
                  value={annualFee} onChange={(e) => setAnnualFee(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Performance Carry %</span>
                  <span className="text-purple-400">{performanceCarry}%</span>
                </div>
                <input 
                  type="range" min="5" max="40" step="5"
                  value={performanceCarry} onChange={(e) => setPerformanceCarry(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">Exit Multiple</span>
                  <span className="text-purple-400">{exitMultiple.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.05"
                  value={exitMultiple} onChange={(e) => setExitMultiple(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </aside>
        </div>

        <footer className="text-center text-[10px] text-slate-700 uppercase tracking-widest pt-8">
          // PIPELINE VERIFIED AND UNLOCKED //
        </footer>
      </div>
    </div>
  );
}