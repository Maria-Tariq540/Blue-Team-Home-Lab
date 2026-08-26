"use client";

import { useEffect, useState } from "react";
import { Monitor, Shield, Skull, Server } from "lucide-react";

type Node = { id: string; label: string; type: string; ip: string };
type Edge = { source: string; target: string; label: string };
type Topology = { nodes: Node[]; edges: Edge[] };

export default function TopologyVisualizer() {
  const [topology, setTopology] = useState<Topology | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/topology")
      .then((res) => res.json())
      .then((data) => setTopology(data))
      .catch((err) => console.error("Failed to load topology", err));
  }, []);

  if (!topology) return <div className="text-gray-500 flex items-center justify-center h-full">Loading topology...</div>;

  const renderIcon = (type: string) => {
    switch (type) {
      case "attacker": return <Skull className="w-8 h-8 text-accent" />;
      case "target": return <Monitor className="w-8 h-8 text-blue-400" />;
      case "siem": return <Shield className="w-8 h-8 text-primary" />;
      default: return <Server className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[250px] flex items-center justify-center bg-black/40 rounded border border-gray-800/50 p-4 overflow-hidden">
      {/* Simplified visual representation instead of a complex D3 graph for this mock */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-2xl gap-8">
        
        {/* Attacker */}
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-900 rounded border border-accent/30 shadow-[0_0_15px_rgba(255,0,60,0.1)]">
          {renderIcon("attacker")}
          <span className="text-xs font-bold text-accent">Kali Attacker</span>
          <span className="text-[10px] text-gray-500 font-mono">192.168.1.100</span>
        </div>

        {/* Network / Attacks */}
        <div className="flex flex-col items-center flex-1 w-full border-t border-dashed border-gray-600 relative">
           <div className="absolute -top-3 text-[10px] text-gray-500 bg-panel px-2">Attacks</div>
        </div>

        {/* Targets */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-900 rounded border border-blue-400/30">
            {renderIcon("target")}
            <span className="text-xs font-bold text-blue-400">Windows Target</span>
            <span className="text-[10px] text-gray-500 font-mono">192.168.1.50</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-900 rounded border border-blue-400/30">
            {renderIcon("target")}
            <span className="text-xs font-bold text-blue-400">Linux Target</span>
            <span className="text-[10px] text-gray-500 font-mono">192.168.1.51</span>
          </div>
        </div>

        {/* Network / Logs */}
        <div className="flex flex-col items-center flex-1 w-full border-t border-dashed border-gray-600 relative">
           <div className="absolute -top-3 text-[10px] text-gray-500 bg-panel px-2">Telemetry</div>
        </div>

        {/* SIEM */}
        <div className="flex flex-col items-center gap-2 p-3 bg-gray-900 rounded border border-primary/30 shadow-[0_0_15px_rgba(0,255,204,0.1)]">
          {renderIcon("siem")}
          <span className="text-xs font-bold text-primary">Wazuh/Elastic</span>
          <span className="text-[10px] text-gray-500 font-mono">192.168.1.10</span>
        </div>
      </div>
    </div>
  );
}
