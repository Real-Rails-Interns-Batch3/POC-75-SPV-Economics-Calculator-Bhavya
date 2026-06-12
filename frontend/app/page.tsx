"use client";

import React, { useState, useEffect } from 'react';

const adaptSPVData = (rawAsset: any) => {
  const cap = Number(rawAsset.totalCapital.replace(/[^0-9.-]+/g, ""));
  const feeRate = Number(rawAsset.mgmtFee.replace(/[^0-9.-]+/g, "")) / 100;
  
  const lifetimeFees = cap * feeRate * 5; 
  const netInvested = cap - lifetimeFees;

  return {
    ...rawAsset,
    numericCapital: cap,
    lifetimeFees: `$${(lifetimeFees / 1000000).toFixed(2)}M`,
    netInvested: `$${(netInvested / 1000000).toFixed(2)}M`,
  };
};

export default function SPVEconomicsCalculator() {
  const [database, setDatabase] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [comparisonAssetId, setComparisonAssetId] = useState(""); 
  const [filterExemption, setFilterExemption] = useState("ALL");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [syntheticWarning, setSyntheticWarning] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAPIData() {
      try {
        const response = await fetch("http://localhost:8000/api/v1/spv-assets");
        const jsonWrapper = await response.json();
        
        setSyntheticWarning(jsonWrapper.metadata.LEGAL_NOTICE);
        const adaptedData = jsonWrapper.records.map((asset: any) => adaptSPVData(asset));
        
        setDatabase(adaptedData);
        if (adaptedData.length > 0) {
          setSelectedAssetId(adaptedData[0].id);
          setComparisonAssetId(adaptedData[1]?.id || adaptedData[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error("API Fetch Error:", error);
        setLoading(false);
      }
    }
    fetchAPIData();
  }, []);

  if (loading || !selectedAssetId) {
    return <div className="min-h-screen bg-[#030712] text-cyan-400 flex items-center justify-center font-mono">// READING FROM SYNTHETIC DATA ENVELOPE...</div>;
  }

  const currentAsset = database.find(a => a.id === selectedAssetId) || database[0];
  const compareAsset = database.find(a => a.id === comparisonAssetId) || database[1];
  const filteredAssets = database.filter(item => filterExemption === "ALL" || item.status === filterExemption);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-300 font-mono flex">
      
      {/* LEFT SIDEBAR (30% Ratio) */}
      <aside className="w-[30%] min-w-[340px] max-w-[420px] border-r border-slate-900 bg-[#070b18] p-6 flex flex-col gap-6 h-screen sticky top-0 overflow-y-auto">
        <div>
          <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">// SYSTEM ENVIRONMENT</div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase mt-1">SPV Economics Engine</h1>
        </div>

        {/* Dynamic Governance Notice */}
        <div className="w-full bg-[#090d1a]/80 border border-slate-900 rounded-lg p-4">
          <div className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-2">🛡️ GOVERNANCE & CONTROL OVERVIEW</div>
          <span className="text-slate-500 block text-[10px]">RAIL CONTROLLER:</span>
          <span className="text-white font-sans text-xs font-bold block mb-2">{currentAsset.controller}</span>
          <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
            Governs capital call thresholds, enforces calculation alignment during distribution cascades, and provides immutable accounting for compliance tracking.
          </p>
        </div>

        {/* Exemption Filter Dropdown */}
        <div className="w-full bg-[#090d1a]/60 border border-slate-900 rounded-lg p-4">
          <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-3">⚡ EXEMPTION CRITERIA FILTERS</div>
          <select 
            value={filterExemption}
            onChange={(e) => setFilterExemption(e.target.value)}
            className="w-full bg-[#050811] border border-slate-900 rounded p-2.5 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">SHOW ALL SPV ASSET NODES</option>
            <option value="EXEMPTED_POOL">SEC EXEMPTED POOLS</option>
            <option value="QUALIFIED_PURCHASER">SEC QUALIFIED PURCHASERS</option>
          </select>
        </div>

        {/* Active Node Selection Cards */}
        <div className="w-full bg-[#090d1a]/60 border border-slate-900 rounded-lg p-4">
          <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-3">📁 ACTIVE ASSET WATERFALL NODES</div>
          <div className="flex flex-col gap-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAssetId === asset.id
                    ? 'bg-cyan-950/20 border-cyan-500 text-cyan-400'
                    : 'bg-[#0b1122] border-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold font-sans">{asset.name}</div>
                <div className="text-[10px] opacity-60 mt-1">{asset.totalCapital} Capital Node</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD BLOCK (70% Ratio) */}
      <main className="w-[70%] flex-1 p-6 md:p-8 flex flex-col gap-8 min-h-screen overflow-y-auto">
        
        {/* Synthetic Verification Banner */}
        <div className="w-full bg-red-950/20 border border-red-900/60 p-3 rounded text-[11px] text-red-400 tracking-wide uppercase">
          ⚠️ {syntheticWarning}
        </div>

        {/* SEC EDGAR Pipeline Match Block */}
        <section className="w-full bg-gradient-to-r from-slate-950 to-[#090d1a] border border-slate-900 rounded-lg p-5 flex items-center justify-between shadow-2xl">
          <div>
            <div className="text-[10px] text-cyan-400 font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE SEC EDGAR REAL-TIME PIPELINE INTERFACE
            </div>
            <h2 className="text-base font-bold text-white font-sans mt-1">{currentAsset.name} SEC Ledger Match</h2>
            <p className="text-[11px] text-slate-500">Automated synchronization with filing documentation systems.</p>
          </div>
          <div className="bg-[#050811] border border-slate-900 p-3 rounded text-right space-y-1">
            <div className="text-[10px] text-slate-400">CIK INDEX ID: <span className="text-yellow-400 font-bold">{currentAsset.edgarCik}</span></div>
            <div className="text-[9px] text-slate-500 uppercase">{currentAsset.secForm} STATUS</div>
          </div>
        </section>

        {/* Metric Footprint Display Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="bg-[#090d1a]/60 border border-slate-900 rounded-lg p-5">
            <span className="text-[10px] text-slate-500 block uppercase">Gross Vehicle Capital</span>
            <span className="text-xl font-black text-white block mt-2">{currentAsset.totalCapital}</span>
            <div className="text-[9px] text-slate-600 mt-2">Total committed asset footprint.</div>
          </div>

          <div 
            className="bg-[#090d1a]/60 border border-slate-900 rounded-lg p-5 relative cursor-help"
            onMouseEnter={() => setActiveTooltip('mgmt-fee')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase">Management Fee Impact ⓘ</span>
            <span className="text-xl font-black text-amber-500 block mt-2">{currentAsset.mgmtFee} <span className="text-xs text-slate-500">p.a.</span></span>
            <div className="text-[9px] text-slate-600 mt-2">Total Budget Allocation: <span className="text-slate-400 font-bold">{currentAsset.lifetimeFees}</span></div>
            
            {activeTooltip === 'mgmt-fee' && (
              <div className="absolute left-0 right-0 -top-24 bg-slate-950 border border-cyan-500 p-3 rounded shadow-2xl text-[11px] text-slate-300 font-sans z-50">
                Tracks total fund capital deducted systematically over operational life phases.
              </div>
            )}
          </div>

          <div 
            className="bg-[#090d1a]/60 border border-slate-900 rounded-lg p-5 relative cursor-help"
            onMouseEnter={() => setActiveTooltip('carry')}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 uppercase">Carried Interest Vector ⓘ</span>
            <span className="text-xl font-black text-emerald-400 block mt-2">{currentAsset.carry} Ratio</span>
            <div className="text-[9px] text-slate-600 mt-2">Net Capital Deploy Base: <span className="text-slate-400 font-bold">{currentAsset.netInvested}</span></div>
            
            {activeTooltip === 'carry' && (
              <div className="absolute left-0 right-0 -top-24 bg-slate-950 border border-cyan-500 p-3 rounded shadow-2xl text-[11px] text-slate-300 font-sans z-50">
                The performance fee sharing ratio split triggered exclusively once deployment thresholds hurdle.
              </div>
            )}
          </div>
        </section>

        {/* Side-by-Side Evaluation Table */}
        <section className="w-full bg-[#090d1a]/60 border border-slate-900 rounded-lg p-6 shadow-xl">
          <div className="text-[11px] text-blue-500 font-bold tracking-widest uppercase mb-4">
            ⚖️ SIDE-BY-SIDE SPV ENTITY COMPARISON MATRIX
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Entity Module Focus (A)</label>
              <select 
                value={selectedAssetId} 
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-[#050811] border border-slate-900 rounded p-3 text-xs text-white font-bold outline-none cursor-pointer"
              >
                {database.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Comparison Entity Target (B)</label>
              <select 
                value={comparisonAssetId} 
                onChange={(e) => setComparisonAssetId(e.target.value)}
                className="w-full bg-[#050811] border border-slate-900 rounded p-3 text-xs text-cyan-400 font-bold outline-none cursor-pointer"
              >
                {database.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 border border-slate-900 rounded-lg overflow-hidden text-xs bg-[#050811]">
            <div className="grid grid-cols-3 bg-[#090d1a] p-3 border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
              <span>METRIC ARCHITECTURE</span>
              <span>ENTITY FOCUS (A)</span>
              <span className="text-right">COMPARE TARGET (B)</span>
            </div>
            <div className="divide-y divide-slate-900/60 font-bold">
              <div className="grid grid-cols-3 p-3.5 items-center"><span className="text-slate-400">Asset Title</span><span className="text-white font-sans">{currentAsset.name}</span><span className="text-cyan-400 font-sans text-right">{compareAsset.name}</span></div>
              <div className="grid grid-cols-3 p-3.5 items-center"><span className="text-slate-400">Gross Vault Commitment</span><span className="text-white">{currentAsset.totalCapital}</span><span className="text-cyan-400 text-right">{compareAsset.totalCapital}</span></div>
              <div className="grid grid-cols-3 p-3.5 items-center"><span className="text-slate-400">Total Lifetime Operational Fees</span><span className="text-amber-500">{currentAsset.lifetimeFees}</span><span className="text-amber-500 text-right">{compareAsset.lifetimeFees}</span></div>
              <div className="grid grid-cols-3 p-3.5 items-center"><span className="text-slate-400">Net Invested Venture Yield</span><span className="text-emerald-400">{currentAsset.netInvested}</span><span className="text-emerald-400 text-right">{compareAsset.netInvested}</span></div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}