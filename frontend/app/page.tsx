"use client";

import React, { useState } from 'react';

export default function Page() {
  // --- PRIVATE ASSET PORTFOLIO DICTIONARY ---
  const [activeAsset, setActiveAsset] = useState("Stripe Enterprise Core");
  const [fundraisingGoal, setFundraisingGoal] = useState(2500000);
  const [annualFee, setAnnualFee] = useState(2.00);
  const [performanceCarry, setPerformanceCarry] = useState(20);
  const [exitMultiple, setExitMultiple] = useState(2.75);

  const assetLedger: Record<string, { baseGoal: number; defaultFee: number; defaultCarry: number; defaultMultiple: number; roi: string }> = {
    "SpaceX Tier-1 Secondary": { baseGoal: 3500000, defaultFee: 1.75, defaultCarry: 15, defaultMultiple: 2.79, roi: "2.79x ROI" },
    "Stripe Enterprise Core": { baseGoal: 2500000, defaultFee: 2.00, defaultCarry: 20, defaultMultiple: 2.75, roi: "2.18x ROI" },
    "Anthropic Seed Allocation": { baseGoal: 1500000, defaultFee: 2.50, defaultCarry: 25, defaultMultiple: 2.88, roi: "2.88x ROI" }
  };

  // --- HANDSHAKE UPDATE INTERACTION TRIGGER ---
  const handleAssetHandshake = (assetName: string) => {
    setActiveAsset(assetName);
    const targetData = assetLedger[assetName];
    setFundraisingGoal(targetData.baseGoal);
    setAnnualFee(targetData.defaultFee);
    setPerformanceCarry(targetData.defaultCarry);
    setExitMultiple(targetData.defaultMultiple);
  };

  // --- WATERFALL LOGIC ENGINE METRICS ---
  const grossProceeds = fundraisingGoal * exitMultiple;
  const totalFeesAndCarry = grossProceeds * ((annualFee / 100) + (performanceCarry / 100));
  const netToInvestors = grossProceeds - totalFeesAndCarry;
  const dealMultiple = (netToInvestors / fundraisingGoal).toFixed(2);
  const investorProfits = netToInvestors - fundraisingGoal;

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-300 font-mono p-4 md:p-8 block overflow-y-visible">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 pb-24">
        
        {/* PLATFORM BRANDING HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 gap-2">
          <div>
            <div className="text-[10px] text-purple-500 font-bold tracking-widest uppercase">// CAP FORMATION INTEL</div>
            <h1 className="text-xl font-black text-white tracking-wider uppercase mt-0.5">SPV Economics Calculator</h1>
          </div>
          <div className="text-[11px] font-bold bg-slate-900/50 border border-slate-900 px-3 py-1.5 rounded text-cyan-400">
            Infrastructure: <span className="text-emerald-400 animate-pulse">Sync Active</span>
          </div>
        </header>

        {/* =========================================================
            CORE WORKSPACE GRID: 70% MAIN METRICS / 30% SIDEBAR INPUTS
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          
          {/* 70% MAIN ANALYTICS VIEWPORTS (7 Columns out of 10) */}
          <main className="lg:col-span-7 flex flex-col gap-8 w-full">
            
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1">Asset Liquidation Waterfall</h2>
              <p className="text-xs text-slate-500 mb-6 font-sans">Real-time accounting ledger and yield optimization analytics.</p>
              
              {/* PRIMARY FINANCIAL TELEMETRY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#050811] border border-slate-900 rounded p-4">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Gross Portfolio Exit</div>
                  <div className="text-xl font-black text-white mt-1">${grossProceeds.toLocaleString()}</div>
                </div>
                <div className="bg-[#050811] border border-emerald-950 rounded p-4">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Net Cash Distributed LPs</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">${netToInvestors.toLocaleString()}</div>
                </div>
                <div className="bg-[#050811] border border-cyan-950 rounded p-4">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Net Deal Return Multiple</div>
                  <div className="text-xl font-black text-cyan-400 mt-1">{dealMultiple}x</div>
                </div>
              </div>

              {/* WATERFALL APPORTIONMENT GRAPH SPLIT */}
              <div className="p-4 bg-[#050811] border border-slate-900 rounded flex flex-col items-center justify-center min-h-[220px] mb-6">
                <div className="text-[10px] text-slate-500 font-bold uppercase self-start mb-4">// ASSET YIELD CAPITAL DISTRIBUTION SPLIT</div>
                <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden flex border border-slate-900">
                  <div style={{ width: `${Math.min(100, (fundraisingGoal / grossProceeds) * 100)}%` }} className="h-full bg-slate-700" title="Principal" />
                  <div style={{ width: `${Math.max(0, (investorProfits / grossProceeds) * 100)}%` }} className="h-full bg-emerald-500" title="Profits" />
                  <div style={{ width: `${Math.min(100, (totalFeesAndCarry / grossProceeds) * 100)}%` }} className="h-full bg-cyan-500" title="Fees" />
                </div>
                <div className="flex flex-wrap gap-4 mt-6 text-[9px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 bg-slate-700 rounded-full" /> Principal Payback</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Net LP Profits</span>
                  <span className="flex items-center gap-1.5 text-cyan-400"><span className="w-2 h-2 bg-cyan-500 rounded-full" /> Fees & Carry</span>
                </div>
              </div>
            </div>

            {/* ACCOUNTING DEBENTURE SUMMARY MODULE */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-6 shadow-xl">
              <div className="text-[10px] text-purple-500 font-bold tracking-widest uppercase mb-4">// WATERFALL DISTRIBUTION ACCOUNTING</div>
              <div className="divide-y divide-slate-900 text-xs font-bold space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-normal">Effective Capital Deployed</span>
                  <span className="text-white">${fundraisingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Initial Principal Payback</span>
                  <span className="text-white">${fundraisingGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Net Investor Profits</span>
                  <span className="text-emerald-400">${investorProfits > 0 ? investorProfits.toLocaleString() : 0}</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-500 font-normal">Manager Fees + Carry</span>
                  <span className="text-cyan-400">${totalFeesAndCarry.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </main>

          {/* 30% CONTROL SIDEBAR (3 Columns out of 10) */}
          <aside className="lg:col-span-3 flex flex-col gap-6 w-full">
            
            {/* ASSET LEDGER CARD STACK */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-4 shadow-xl flex flex-col gap-2">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Private Asset Ledgers</div>
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

            {/* DYNAMIC PARAMETER SIMULATION SLIDERS */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-4 shadow-xl space-y-5">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">// VARIABLE PARAMETERS</div>
              
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
                  <span className="text-slate-400">Exit Growth Multiple</span>
                  <span className="text-purple-400">{exitMultiple.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.05"
                  value={exitMultiple} onChange={(e) => setExitMultiple(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            {/* CONTEXT CALLOUT EXPLANATION BOX */}
            <div className="bg-[#090d1a]/40 border border-slate-900 rounded-lg p-4 shadow-xl text-[11px] font-sans text-slate-400 leading-relaxed">
              💡 <strong>Why this matters:</strong> Asset management fees systematically reduce the active investment sizing available for execution. This ledger tracks how programmatic overhead changes structural return vectors.
            </div>

          </aside>

        </div>

        {/* COMPREHENSIVE TERMINAL SCROLL EXTENSION BAR */}
        <div className="w-full text-center py-4 border-t border-slate-900/60 mt-4 text-[10px] text-slate-600 tracking-widest">
          // PIPELINE COMPLETE // 70:30 RUNWAY VIEWPORT ACTIVE AND UNLOCKED //
        </div>

      </div>
    </div>
  );
}