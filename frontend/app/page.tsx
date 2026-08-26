"use client";

import { useState } from "react";
import TopologyVisualizer from "@/components/TopologyVisualizer";
import AttackPlaybook from "@/components/AttackPlaybook";
import LogStreamer, { LogEvent } from "@/components/LogStreamer";
import RuleBuilder from "@/components/RuleBuilder";
import ReportGenerator from "@/components/ReportGenerator";
import { ShieldAlert } from "lucide-react";

export default function Home() {
  const [logs, setLogs] = useState<LogEvent[]>([]);

  return (
    <main className="min-h-screen p-6 flex flex-col gap-6">
      <header className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-wider text-primary">BLUE TEAM HOME LAB</h1>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">Threat Simulation Dashboard</span>
          <ReportGenerator logs={logs} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <section className="bg-panel rounded-lg border border-gray-800 flex flex-col overflow-hidden shadow-lg shadow-black/50">
          <div className="p-3 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Lab Topology</h2>
          </div>
          <div className="p-4 flex-1">
            <TopologyVisualizer />
          </div>
        </section>

        <section className="bg-panel rounded-lg border border-gray-800 flex flex-col overflow-hidden shadow-lg shadow-black/50">
          <div className="p-3 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Attack Playbook</h2>
          </div>
          <div className="p-4 flex-1">
            <AttackPlaybook />
          </div>
        </section>

        <section className="bg-panel rounded-lg border border-gray-800 flex flex-col overflow-hidden shadow-lg shadow-black/50 h-[400px]">
          <div className="p-3 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Live SIEM Logs</h2>
          </div>
          <div className="p-0 flex-1 overflow-hidden">
            <LogStreamer onLogsUpdated={setLogs} />
          </div>
        </section>

        <section className="bg-panel rounded-lg border border-gray-800 flex flex-col overflow-hidden shadow-lg shadow-black/50 h-[400px]">
          <div className="p-3 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Detection & Incident Response</h2>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <RuleBuilder />
          </div>
        </section>
      </div>
    </main>
  );
}
