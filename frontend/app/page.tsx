"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AssetProfile {
  source: string;
  fundraisingGoal: number;
  managementFee: number;
  performanceCarry: number;
  exitMultiple: number;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SPVCalculatorDashboard() {
  const [secData, setSecData] = useState<Record<string, AssetProfile>>({
    "Stripe Enterprise Core": {
      source: "Local Cache (Awaiting Live SEC Link)",
      fundraisingGoal: 2500000,
      managementFee: 2.00,
      performanceCarry: 20,
      exitMultiple: 2.75,
      description: "Production scale automated syndicate tracking pipeline matching ticker asset."
    }
  });

  const [selectedAsset, setSelectedAsset] = useState<string>("Stripe Enterprise Core");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  // Hardcoded fallback base array vectors to populate stats panels flawlessly
  const [fundraisingGoal, setFundraisingGoal] = useState<number>(2500000);
  const [annualFee, setAnnualFee] = useState<number>(2.00);
  const [carryPercent, setCarryPercent] = useState<number>(20);
  const [exitMultiple, setExitMultiple] = useState<number>(3.84);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/sec-feed`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSecData(data);
          const firstKey = Object.keys(data)[0];
          triggerHandshake(firstKey, data[firstKey]);
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
    setIsPanelOpen(true);
  };

  const operationalFeeOverhead = fundraisingGoal * (annualFee / 100) * 10;
  const netCapitalDeployed = fundraisingGoal - operationalFeeOverhead;
  const grossPortfolioExit = fundraisingGoal * exitMultiple;
  
  const totalNetProfit = Math.max(0, grossPortfolioExit - fundraisingGoal);
  const managerAggregateCarry = totalNetProfit * (carryPercent / 100);
  const netCashDistributedLPs = grossPortfolioExit - managerAggregateCarry;
  const netDealReturnMultiple = netCashDistributedLPs / fundraisingGoal;
  const breakEvenMultiple = parseFloat((fundraisingGoal / netCapitalDeployed).toFixed(2));

  const generatedChartData = [
    { name: "Deployed Capital", value: netCapitalDeployed, color: "#4f46e5" },
    { name: "Principal Base", value: fundraisingGoal, color: "#6366f1" },
    { name: "LP Distro Yield", value: netCashDistributedLPs, color: "#10b981" },
    { name: "Gross Portfolio Exit", value: grossPortfolioExit, color: "#a855f7" },
  ];

  const filteredAssetKeys = Object.keys(secData).filter(key =>
    key.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    // Unique Visual DNA: Cold obsidian base with slate-purple layers [cite: 5, 11]
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Pillar III: The Developer Signature (Infocreon Minimalist Header Bar) [cite: 19, 20] */}
      <header className="w-full h-16 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md px-8 flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
          <h1 className="text-sm font-bold tracking-widest text-slate-200 uppercase">
            Infocreon Internship - SPV Economics Calculator
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPanelOpen(true)}
            className="px-3 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded text-xs transition font-semibold"
          >
            🎛️ Show Metrics Panel
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-full border border-slate-700 hover:border-purple-500 flex items-center justify-center text-slate-400 hover:text-purple-400 font-mono text-sm transition font-bold bg-slate-900/40"
          >
            ℹ
          </button>
        </div>
      </header>

      {/* Pillar II: The "Click & Move" Stage Container (100% Full Screen Surface) [cite: 13, 14] */}
      <div className="flex-1 w-full p-8 relative z-10 flex flex-col justify-between">
        <div className="w-full flex-1 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl backdrop-blur-sm">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-purple-400 font-mono font-bold">// FINANCIAL INTELLIGENCE MATRIX STAGE</span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">{selectedAsset}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {secData[selectedAsset]?.description}
              </p>
            </div>

            <div 
              className="bg-slate-950/80 px-5 py-3 rounded-xl border border-purple-500/30 text-right cursor-help relative"
              onMouseEnter={() => setHoveredTooltip("breakeven")}
              onMouseLeave={() => setHoveredTooltip(null)}
            >
              <span className="text-[9px] block uppercase text-purple-400 tracking-wider font-mono font-bold">Break-Even Point</span>
              <span className="text-xl font-black text-white font-mono">{breakEvenMultiple}x</span>
              {hoveredTooltip === "breakeven" && (
                <div className="absolute right-0 top-14 z-50 w-72 p-4 bg-[#0b0f19] text-slate-300 text-xs text-left rounded-xl border border-purple-500/50 shadow-2xl leading-relaxed">
                  <strong>Structural Yield Importance:</strong> Defines the baseline fund performance multiple required to entirely cover vehicle structural fee overheads, delivering 100% principal back to LPs.
                </div>
              )}
            </div>
          </div>

          {/* 📊 Core Waterfall Block Visualization Track */}
          <div className="w-full h-[360px] min-h-[360px] my-4 bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between relative">
            
            {/* Native CSS Flexible Indicator Bar Fallback Matrix */}
            <div className="absolute inset-0 p-8 flex items-end justify-between gap-6 pointer-events-none z-0">
              {generatedChartData.map((bar, idx) => {
                const heightPercentage = Math.min(100, Math.max(8, (bar.value / grossPortfolioExit) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div 
                      style={{ 
                        height: `${heightPercentage}%`,
                        backgroundColor: bar.color 
                      }} 
                      className="w-full rounded-t-lg opacity-25 shadow-2xl transition-all duration-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Recharts SVG Interactive Layer Overlay */}
            <div className="w-full h-full z-10 relative">
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={generatedChartData} barGap={8} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip cursor={{ fill: '#1e1b4b', opacity: 0.15 }} contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="url(#purpleGradient)" radius={[8, 8, 0, 0]} maxBarSize={55}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Grid Deck */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Gross Exit</span>
              <span className="text-xl font-bold text-white font-mono block mt-1">${grossPortfolioExit.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">LP Allocation</span>
              <span className="text-xl font-bold text-emerald-400 font-mono block mt-1">${netCashDistributedLPs.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Net Yield Multiple</span>
              <span className="text-xl font-bold text-cyan-400 font-mono block mt-1">{netDealReturnMultiple.toFixed(2)}x</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Asset Ingestion</span>
              <span className="text-xl font-bold text-purple-400 font-mono block mt-1 truncate">SEC Form D</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar II: Slide-over Intelligence Panel [cite: 15, 16] */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-[#0b0f19] border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Intelligence Panel</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">UNDERWRITING PARAMETERS</p>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition text-xs font-bold border border-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block">SEC ASSET SELECTOR</span>
            <input 
              type="text"
              placeholder="🔍 Search node registries..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredAssetKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => triggerHandshake(key, secData[key])}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition duration-150 font-mono flex justify-between items-center border ${
                    selectedAsset === key 
                      ? "bg-purple-950/30 text-purple-300 font-bold border-purple-500/50" 
                      : "bg-slate-950/60 text-slate-400 hover:bg-slate-800/40 border-transparent"
                  }`}
                >
                  <span className="truncate mr-2">{key}</span>
                  <span className="text-purple-400 text-[11px] shrink-0">{secData[key].exitMultiple}x</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-800/80 pt-4">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 block">// MODEL CALIBRATION NODES</span>
            
            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Target Capital</span>
                <span className="text-purple-400 font-bold">${fundraisingGoal.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="1000000" max="10000000" step="100000" 
                value={fundraisingGoal} onChange={(e) => setFundraisingGoal(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Management Fee</span>
                <span className="text-purple-400 font-bold">{annualFee.toFixed(2)}%</span>
              </div>
              <input 
                type="range" min="0.0" max="5.0" step="0.25" 
                value={annualFee} onChange={(e) => setAnnualFee(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Performance Carry</span>
                <span className="text-purple-400 font-bold">{carryPercent}%</span>
              </div>
              <input 
                type="range" min="0" max="35" step="5" 
                value={carryPercent} onChange={(e) => setCarryPercent(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Exit Multiple</span>
                <span className="text-purple-400 font-bold">{exitMultiple.toFixed(2)}x</span>
              </div>
              <input 
                type="range" min="1.0" max="5.0" step="0.05" 
                value={exitMultiple} onChange={(e) => setExitMultiple(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2 font-mono">
          <p>🛠️ **Control Node:** Managed by Syndicate Lead / Allocator.</p>
          <p>🎯 **Core Purpose:** Mitigates risk modeling degradation across performance tiers.</p>
        </div>
      </div>

      {/* Pillar III: Developer Signature Popover Modal [cite: 21, 22] */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">System Metadata</h3>
            
            <div className="space-y-4 text-sm border-b border-slate-800 pb-6 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">DEVELOPER</span>
                <span className="text-white font-medium font-mono">Bhavya S Shaji</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">POC ID</span>
                <span className="text-white font-medium font-mono">POC-75-SPV-Economics Calculator</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">BATCH</span>
                <span className="text-white font-medium font-mono">Batch A / Computer Science</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">STACK</span>
                <span className="text-white font-medium font-mono">Next.js 14 / FastAPI / TypeScript / Tailwind CSS / Recharts</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">RAIL</span>
                <span className="text-white font-medium font-mono">Financial Intelligence Rail</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-semibold tracking-wider text-slate-200 transition"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
      
      <footer className="w-full h-8 border-t border-slate-900 bg-slate-950/30 px-8 flex items-center justify-center text-[9px] text-slate-500 font-mono tracking-widest z-10">
        INFOCREON BLOCK MATRIX MODULE SYSTEMS V0.2.0 // DEPLOYMENT READY VECTORS
      </footer>
    </main>
  );
}