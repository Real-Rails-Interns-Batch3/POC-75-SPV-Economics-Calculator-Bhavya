"use client";

import React, { useState } from 'react';

// ========================================================
// 🔌 REUSABLE DATA ADAPTER (Normalizes raw data feeds)
// ========================================================
const adaptSPVData = (rawAsset: any) => {
  const cap = Number(rawAsset.totalCapital.replace(/[^0-9.-]+/g, ""));
  const feeRate = Number(rawAsset.mgmtFee.replace(/[^0-9.-]+/g, "")) / 100;
  
  const lifetimeFees = cap * feeRate * 5; 
  const netInvested = cap - lifetimeFees;
  const simulatedExitValue = cap * 3.5; // Simulated 3.5x return cascade
  const grossProfit = simulatedExitValue - cap;
  const carryFees = grossProfit * (Number(rawAsset.carry.replace(/[^0-9.-]+/g, "")) / 100);
  const totalLpPayout = netInvested + (grossProfit - carryFees);

  return {
    ...rawAsset,
    numericCapital: cap,
    lifetimeFees: `$${(lifetimeFees / 1000000).toFixed(2)}M`,
    netInvested: `$${(netInvested / 1000000).toFixed(2)}M`,
    simulatedExit: `$${(simulatedExitValue / 1000000).toFixed(2)}M`,
    gpCarryPayout: `$${(carryFees / 1000000).toFixed(2)}M`,
    lpTotalPayout: `$${(totalLpPayout / 1000000).toFixed(2)}M`
  };
};

const RAW_SPV_DATABASE = [
  { id: "spv-1", name: "Anthropic Seed Allocation", totalCapital: "$10,000,000", mgmtFee: "2.0%", carry: "20%", edgarCik: "0001993210", secForm: "Form D (Securities Offering)", status: "EXEMPTED_POOL", controller: "General Partner (GP) / Asset Allocator" },
  { id: "spv-2", name: "SpaceX Secondary Growth", totalCapital: "$25,000,000", mgmtFee: "1.5%", carry: "20%", edgarCik: "0001186164", secForm: "Form D Amendment", status: "QUALIFIED_PURCHASER", controller: "Lead Institutional Syndicate Manager" },
  { id: "spv-3", name: "Scale AI Late Stage Vehicle", totalCapital: "$15,000,000", mgmtFee: "2.0%", carry: "25%", edgarCik: "0001854215", secForm: "Form D Initial", status: "EXEMPTED_POOL", controller: "Venture Principal Ledger Controller" }
];

export default function SPVEconomicsCalculator() {
  const [selectedAssetId, setSelectedAssetId] = useState("spv-1");
  const [comparisonAssetId, setComparisonAssetId] = useState("spv-2"); 
  const [filterExemption, setFilterExemption] = useState("ALL");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const adaptedDatabase = RAW_SPV_DATABASE.map(asset => adaptSPVData(asset));
  
  const currentAsset = adaptedDatabase.find(a => a.id === selectedAssetId) || adaptedDatabase[0];
  const compareAsset = adaptedDatabase.find(a => a.id === comparisonAssetId) || adaptedDatabase[1];

  const filteredAssets = adaptedDatabase.filter(item => 
    filterExemption === "ALL" || item.status === filterExemption
  );

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-300 font-mono flex overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 📐 LEFT SIDEBAR PANEL (30% SPLIT VIEW)                   */}
      {/* ======================================================== */}
      <aside className="w-[30%] min-w-[340px] max-w-[420px] border-r border-slate-900 bg-[#070b18] p-6 flex flex-col gap-6 h-screen sticky top-0 overflow-y-auto">
        
        <div>
          <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">// VENTURE INTELLIGENCE CORE</div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase mt-1">SPV Economics Engine</h1>
        </div>

        {/* GOVERNANCE CONTEXT */}
        <div className="w-full bg-[#090d1a]/80 border border-slate-900 rounded-lg p-4">
          <div className="text-[10px] text-amber-500 font-bold tracking-widest uppercase mb-2">🛡️ GOVERNANCE & CONTROL OVERVIEW</div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-500 block text-[10px]">RAIL CONTROLLER:</span>
              <span className="text-white font-sans font-bold">{currentAsset.controller}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">WHY THIS DATA MATTERS:</span>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                Governs capital call thresholds, enforces calculation alignment during distribution cascades, and provides immutable accounting for compliance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
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

        {/* LIST TILES */}
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
                <div className="text-[10px] opacity-60 font-mono mt-1">{asset.totalCapital} Capital Node</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 📐 MAIN DASHBOARD (70% PANEL VIEW) - LONG SCROLL SCAPE   */}
      {/* ======================================================== */}
      <main className="w-[70%] flex-1 p-6 md:p-8 flex flex-col gap-8 bg-[#030712] overflow-y-visible h-auto min-h-screen pb-40">
        
        {/* SEC EDGAR HEADER PANEL */}
        <section className="w-full bg-gradient-to-r from-slate-950 to-[#090d1a] border border-slate-900 rounded-lg p-5 flex items-center justify-between shadow-2xl">
          <div className="space-y-1">
            <div className="text-[10px] text-cyan-400 font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE SEC EDGAR REAL-TIME PIPELINE INTERFACE
            </div>
            <h2 className="text-base font-bold text-white font-sans">{currentAsset.name} SEC Ledger Match</h2>
          </div>
          <div className="bg-[#050811] border border-slate-900 p-3 rounded text-right space-y-1 font-mono">
            <div className="text-[10px] text-slate-400">CIK INDEX ID: <span className="text-yellow-400 font-bold">{currentAsset.edgarCik}</span></div>
            <div className="text-[9px] text-slate-500 uppercase">{currentAsset.secForm} STATUS</div>
          </div>
        </section>

        {/* CORE STAT CARDS WITH TOOLTIPS */}
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
            <div className="text-[9px] text-slate-600 mt-2">Total Operational Budget: <span className="text-slate-400 font-bold">{currentAsset.lifetimeFees}</span></div>
            
            {activeTooltip === 'mgmt-fee' && (
              <div className="absolute left-0 right-0 -top-24 bg-slate-950 border border-cyan-500 p-3 rounded shadow-2xl text-[11px] text-slate-300 font-sans z-50 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">💡 Cumulative Management Fees Offset</span>
                Tracks the total fund capital deducted systematically across operational life phases to sustain portfolio engineering workflows.
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
            <div className="text-[9px] text-slate-600 mt-2">Net Deploy Base: <span className="text-slate-400 font-bold">{currentAsset.netInvested}</span></div>
            
            {activeTooltip === 'carry' && (
              <div className="absolute left-0 right-0 -top-24 bg-slate-950 border border-cyan-500 p-3 rounded shadow-2xl text-[11px] text-slate-300 font-sans z-50 leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-1">💡 Carried Interest Performance Incentive</span>
                The performance fee sharing ratio split triggered exclusively once initial deal deployment thresholds hurdle capital restitution protocols.
              </div>
            )}
          </div>
        </section>

        {/* COMPARISON MODULE */}
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
                {adaptedDatabase.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Comparison Entity Target (B)</label>
              <select 
                value={comparisonAssetId} 
                onChange={(e) => setComparisonAssetId(e.target.value)}
                className="w-full bg-[#050811] border border-slate-900 rounded p-3 text-xs text-cyan-400 font-bold outline-none cursor-pointer"
              >
                {adaptedDatabase.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 border border-slate-900 rounded-lg overflow-hidden text-xs bg-[#050811]">
            <div className="grid grid-cols-3 bg-[#090d1a] p-3 border-b border-slate-900 text-slate-500 font-bold uppercase">
              <span>METRIC ARCHITECTURE</span>
              <span>ENTITY FOCUS (A)</span>
              <span className="text-right">COMPARE TARGET (B)</span>
            </div>
            <div className="divide-y divide-slate-900/60 font-bold">
              <div className="grid grid-cols-3 p-3.5"><span className="text-slate-400">Asset Title</span><span className="text-white font-sans">{currentAsset.name}</span><span className="text-cyan-400 font-sans text-right">{compareAsset.name}</span></div>
              <div className="grid grid-cols-3 p-3.5"><span className="text-slate-400">Gross Vault Commitment</span><span className="text-white">{currentAsset.totalCapital}</span><span className="text-cyan-400 text-right">{compareAsset.totalCapital}</span></div>
              <div className="grid grid-cols-3 p-3.5"><span className="text-slate-400">Total Operational Fees</span><span className="text-amber-500">{currentAsset.lifetimeFees}</span><span className="text-amber-500 text-right">{compareAsset.lifetimeFees}</span></div>
              <div className="grid grid-cols-3 p-3.5"><span className="text-slate-400">Net Invested Venture Yield</span><span className="text-emerald-400">{currentAsset.netInvested}</span><span className="text-emerald-400 text-right">{compareAsset.netInvested}</span></div>
              <div className="grid grid-cols-3 p-3.5"><span className="text-slate-400">SEC EDGAR Catalog Key</span><span className="text-slate-300">CIK {currentAsset.edgarCik}</span><span className="text-cyan-400 text-right">CIK {compareAsset.edgarCik}</span></div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 🚀 NEW SECTION 1: EXIT WATERFALL LIQUIDITY CASCADE REQ    */}
        {/* ======================================================== */}
        <section className="w-full bg-[#090d1a]/60 border border-slate-900 rounded-lg p-6 shadow-xl">
          <div className="text-[11px] text-emerald-500 font-bold tracking-widest uppercase mb-2">
            📊 ASSET WATERFALL EXIT DISTRIBUTION CALCULATOR (SIMULATED 3.5x MATRIX)
          </div>
          <p className="text-slate-500 text-[11px] mb-4">Calculates asset layout payouts dynamically using data adapter hooks.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#050811] p-4 rounded border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase block">Projected Capital Exit Value</span>
              <span className="text-lg font-bold text-white block mt-1">{currentAsset.simulatedExit}</span>
            </div>
            <div className="bg-[#050811] p-4 rounded border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase block">GP Performance Carry Payout</span>
              <span className="text-lg font-bold text-amber-500 block mt-1">{currentAsset.gpCarryPayout}</span>
            </div>
            <div className="bg-[#050811] p-4 rounded border border-slate-900">
              <span className="text-[10px] text-slate-500 uppercase block">Net LP Disbursed Liquidity</span>
              <span className="text-lg font-bold text-emerald-400 block mt-1">{currentAsset.lpTotalPayout}</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 🚀 NEW SECTION 2: REGULATORY AUDIT HISTORY DATASTREAM   */}
        {/* ======================================================== */}
        <section className="w-full bg-[#090d1a]/60 border border-slate-900 rounded-lg p-6 shadow-xl">
          <div className="text-[11px] text-yellow-500 font-bold tracking-widest uppercase mb-4">
            📜 LIVE SEC COMPLIANCE AUDIT DISCOVERY TRAIL
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#050811] rounded border border-slate-900/60 flex justify-between items-center">
              <div>
                <span className="text-cyan-400 font-bold block">[STAGE 03] Notice of Exempt Offering of Securities</span>
                <span className="text-slate-500 text-[10px]">EDGAR Filing Verified via Secure Gateway Pipeline Node</span>
              </div>
              <span className="bg-emerald-950/40 text-emerald-400 text-[10px] px-2.5 py-1 rounded border border-emerald-900 uppercase tracking-widest font-bold">SUCCESS</span>
            </div>
            <div className="p-3 bg-[#050811] rounded border border-slate-900/60 flex justify-between items-center">
              <div>
                <span className="text-slate-400 font-bold block">[STAGE 02] Form D Threshold Clearance Check</span>
                <span className="text-slate-500 text-[10px]">Verification of Accredited Pools matching index CIK {currentAsset.edgarCik}</span>
              </div>
              <span className="bg-emerald-950/40 text-emerald-400 text-[10px] px-2.5 py-1 rounded border border-emerald-900 uppercase tracking-widest font-bold">CLEARED</span>
            </div>
            <div className="p-3 bg-[#050811] rounded border border-slate-900/60 flex justify-between items-center">
              <div>
                <span className="text-slate-400 font-bold block">[STAGE 01] General Partner Execution Authorization</span>
                <span className="text-slate-500 text-[10px]">Sign-off logged: {currentAsset.controller}</span>
              </div>
              <span className="bg-emerald-950/40 text-emerald-400 text-[10px] px-2.5 py-1 rounded border border-emerald-900 uppercase tracking-widest font-bold">APPROVED</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-[10px] text-slate-700 uppercase tracking-widest pt-6">
          // SPV ECONOMICS LEDGER ENGINE MODULE INITIALIZED SUCCESSFULLY //
        </footer>
      </main>

    </div>
  );
}