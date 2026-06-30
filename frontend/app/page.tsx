"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface AssetProfile {
  source: string;
  fundraisingGoal: number;
  managementFee: number;
  performanceCarry: number;
  exitMultiple: number;
  description: string;
}

// 🟢 Requirement: Decouple hardcoded endpoints using environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SPVCalculatorDashboard() {
  const [secData, setSecData] = useState<Record<string, AssetProfile>>({
    "Stripe Enterprise Core": {
      source: "Local Cache (Awaiting Live SEC Link)",
      fundraisingGoal: 2500000, managementFee: 2.00, performanceCarry: 20, exitMultiple: 2.75,
      description: "Fallback system profile mapping enterprise distribution protocols."
    }
  });

  const [selectedAsset, setSelectedAsset] = useState<string>("Stripe Enterprise Core");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const [fundraisingGoal, setFundraisingGoal] = useState<number>(2500000);
  const [annualFee, setAnnualFee] = useState<number>(2.00);
  const [carryPercent, setCarryPercent] = useState<number>(20);
  const [exitMultiple, setExitMultiple] = useState<number>(2.75);

  useEffect(() => {
    // Dynamically reaching backend channel securely
    fetch(`${API_BASE_URL}/api/v1/sec-feed`)
      .then((res) => res.json())
      .then((data) => {
        setSecData(data);
        if (data["Stripe Enterprise Core"]) {
          triggerHandshake("Stripe Enterprise Core", data["Stripe Enterprise Core"]);
        }
      })
      .catch((err) => console.log("Waiting for backend channel connectivity...", err));
  }, []);

  const triggerHandshake = (key: string, profile: AssetProfile) => {
    setSelectedAsset(key);
    setFundraisingGoal(profile.fundraisingGoal);
    setAnnualFee(profile.managementFee);
    setCarryPercent(profile.performanceCarry);
    setExitMultiple(profile.exitMultiple);
  };

  const operationalFeeOverhead = fundraisingGoal * (annualFee / 100) * 10;
  const netCapitalDeployed = fundraisingGoal - operationalFeeOverhead;
  const grossPortfolioExit = fundraisingGoal * exitMultiple;
  
  const totalNetProfit = Math.max(0, grossPortfolioExit - fundraisingGoal);
  const managerAggregateCarry = totalNetProfit * (carryPercent / 100);
  const netCashDistributedLPs = grossPortfolioExit - managerAggregateCarry;
  const netDealReturnMultiple = netCashDistributedLPs / fundraisingGoal;
  const breakEvenMultiple = parseFloat((fundraisingGoal / netCapitalDeployed).toFixed(2));

  // Generate responsive chart tracking points dynamically for Recharts
  const generatedChartData = [
    { name: "Deployed", value: netCapitalDeployed },
    { name: "Principal Base", value: fundraisingGoal },
    { name: "LP Distro Yield", value: netCashDistributedLPs },
    { name: "Gross Exit", value: grossPortfolioExit },
  ];

  const handleExportMemo = () => {
    const textContext = `
=====================================================
REAL RAILS CAPITAL FORMATION WATERFALL BRIEFING MEMO
=====================================================
Asset Target Entity: ${selectedAsset}
Ingestion Feed Source: SEC EDGAR Form D (SYNTHETIC LABELS)
-----------------------------------------------------
Underwriting Configuration Vector Summary:
- Implemented Target Goal: $${fundraisingGoal.toLocaleString()}
- Configured Management Fees: ${annualFee.toFixed(2)}%
- Target Carried Interest Allocation: ${carryPercent}%
- Target Exit Performance Multiple: ${exitMultiple.toFixed(2)}x
-----------------------------------------------------
Evaluated Deal Allocation Metrics Summary:
* Calculated Break-Even Allocation Multiple: ${breakEvenMultiple}x
* Computed Gross Portfolio Exit Valuation: $${grossPortfolioExit.toLocaleString()}
* Total Cash Allocations Distributed to LPs: $${netCashDistributedLPs.toLocaleString()}
* Net Performance Deal Asset Return Multiple: ${netDealReturnMultiple.toFixed(2)}x
=====================================================
    `.trim();

    const elementBlob = new Blob([textContext], { type: "text/plain;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(elementBlob);
    downloadLink.download = `${selectedAsset.toLowerCase().replace(/ /g, "_")}_investment_memo.txt`;
    downloadLink.click();
  };

  const filteredAssetKeys = Object.keys(secData).filter(key =>
    key.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#030712] p-8 text-slate-100 flex flex-col justify-between selection:bg-purple-500/30">
      
      <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">// SEC EDGAR ANALYTICAL TERMINAL</span>
          <h1 className="text-3xl font-black text-white mt-1 tracking-tight">SPV ECONOMICS CALCULATOR</h1>
        </div>
        <div className="flex gap-4">
          <a 
            href={`${API_BASE_URL}/api/v1/download-sample`}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-semibold text-xs transition duration-200 flex items-center"
          >
            📥 Download Sample Data
          </a>
          <button 
            onClick={handleExportMemo}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded border border-purple-400/20 transition duration-200"
          >
            📋 Export Memo Summary
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start w-full">
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">Asset Liquidation Waterfall</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Audit Node: <span className="text-purple-400 font-medium font-mono">SEC EDGAR Form D (SYNTHETIC LABELS)</span>
                </p>
              </div>
              
              {/* Tooltip implementation */}
              <div 
                className="bg-slate-950 px-4 py-2 rounded-lg border border-amber-500/30 text-right cursor-help relative"
                onMouseEnter={() => setHoveredTooltip("breakeven")}
                onMouseLeave={() => setHoveredTooltip(null)}
              >
                <span className="text-[10px] block uppercase text-slate-400 tracking-wider">Break-Even Multiple</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{breakEvenMultiple}x</span>
                {hoveredTooltip === "breakeven" && (
                  <div className="absolute right-0 top-12 z-50 w-64 p-3 bg-slate-950 text-slate-300 text-xs text-left rounded-lg border border-amber-500 shadow-xl leading-relaxed">
                    <strong>Why this matters:</strong> This dictates the structural baseline exit threshold multiple required to fully return 100% of the primary investor capital commitment back to LPs after subtracting administrative vehicle fee overheads.
                  </div>
                )}
              </div>
            </div>

            {/* 📊 Requirement: Recharts Analytics View integration */}
            <div className="mb-6 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 block mb-4">// LIQUIDATION SCALE VISUALIZATION (RECHARTS)</span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generatedChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip cursor={{ fill: '#1e293b', opacity: 0.2 }} contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '6px' }} />
                    <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Gross Portfolio Exit</span>
                <span className="text-2xl font-black text-white font-mono block mt-1">${grossPortfolioExit.toLocaleString()}</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Net Cash Distributed LPs</span>
                <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">${netCashDistributedLPs.toLocaleString()}</span>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Net Deal Return Multiple</span>
                <span className="text-2xl font-black text-sky-400 font-mono block mt-1">{netDealReturnMultiple.toFixed(2)}x</span>
              </div>
            </div>
          </div>

          {/* Descriptive contextual documentation blocks */}
          <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>Who controls this rail panel?</strong> This visual terminal is managed entirely by the emerging vehicle manager or angel syndicate lead to audit investment yield health profiles.
            </p>
            <p>
              <strong>Why this matters:</strong> Setting precise carry models and verifying clean tracking lines directly against SEC reporting metrics safeguards regulatory structural setups while avoiding performance model translation failure.
            </p>
          </div>
        </section>

        {/* Control side track for variables tuning */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block mb-2">PRIVATE ASSET ENTITIES (SEC)</span>
            <input 
              type="text"
              placeholder="🔍 Filter ledger nodes..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 mb-3 focus:outline-none focus:border-purple-500 font-mono"
            />

            <div className="space-y-2">
              {filteredAssetKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => triggerHandshake(key, secData[key])}
                  className={`w-full text-left p-3 rounded text-xs transition duration-150 font-mono flex justify-between items-center ${
                    selectedAsset === key 
                      ? "bg-purple-950/40 text-purple-200 font-bold border border-purple-500/50 shadow-md" 
                      : "bg-slate-950 text-slate-400 hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <span>{key}</span>
                  <span className={selectedAsset === key ? "text-purple-400" : "text-emerald-500"}>
                    {secData[key].exitMultiple ? `${secData[key].exitMultiple}x ROI` : "--"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block">// VARIABLE TUNING NODES</span>
            
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Fundraising Goal</span>
                <span className="text-purple-400 font-bold">${fundraisingGoal.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="1000000" max="10000000" step="100000" 
                value={fundraisingGoal} onChange={(e) => setFundraisingGoal(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 h-1 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Annual Fee %</span>
                <span className="text-purple-400 font-bold">{annualFee.toFixed(2)}%</span>
              </div>
              <input 
                type="range" min="0.0" max="5.0" step="0.25" 
                value={annualFee} onChange={(e) => setAnnualFee(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 h-1 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Performance Carry %</span>
                <span className="text-purple-400 font-bold">{carryPercent}%</span>
              </div>
              <input 
                type="range" min="0" max="35" step="5" 
                value={carryPercent} onChange={(e) => setCarryPercent(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 h-1 rounded"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Exit Multiple</span>
                <span className="text-purple-400 font-bold">{exitMultiple.toFixed(2)}x</span>
              </div>
              <input 
                type="range" min="1.0" max="5.0" step="0.05" 
                value={exitMultiple} onChange={(e) => setExitMultiple(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-950 h-1 rounded"
              />
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono tracking-wider">
        REAL RAILS BLOCK MATRIX SYSTEM MODULE V0.1.0 // CONTINUOUS RUNWAY CONTEXT PIPELINE
      </footer>
    </main>
  );
}