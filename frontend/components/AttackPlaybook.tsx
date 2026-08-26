"use client";

import { useState } from "react";
import { Terminal, Lock, Activity } from "lucide-react";

export default function AttackPlaybook() {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const triggerAttack = async (type: string) => {
    setLoading(type);
    setStatus(null);
    try {
      const res = await fetch(`http://localhost:8000/api/simulate/${type}`, { method: "POST" });
      const data = await res.json();
      setStatus(`Success: ${data.message}`);
    } catch (err) {
      setStatus(`Error triggering attack.`);
    } finally {
      setTimeout(() => {
        setLoading(null);
        setTimeout(() => setStatus(null), 3000);
      }, 500);
    }
  };

  const attacks = [
    {
      id: "ssh_brute_force",
      name: "SSH Brute-Force",
      description: "Simulate rapid failed SSH login attempts against the Linux target.",
      mitre: "T1110",
      icon: <Lock className="w-5 h-5" />,
      color: "border-orange-500/50 hover:border-orange-500",
    },
    {
      id: "nmap_scan",
      name: "Nmap Port Scan",
      description: "Simulate a stealth SYN scan touching multiple ports on the firewall.",
      mitre: "T1046",
      icon: <Activity className="w-5 h-5" />,
      color: "border-blue-500/50 hover:border-blue-500",
    },
    {
      id: "powershell_encoded",
      name: "Malicious PowerShell",
      description: "Simulate encoded PowerShell command execution on Windows target.",
      mitre: "T1059.001",
      icon: <Terminal className="w-5 h-5" />,
      color: "border-accent/50 hover:border-accent",
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {status && (
        <div className="p-2 text-xs text-primary bg-primary/10 border border-primary/20 rounded">
          {status}
        </div>
      )}
      <div className="grid gap-3">
        {attacks.map((attack) => (
          <button
            key={attack.id}
            onClick={() => triggerAttack(attack.id)}
            disabled={loading !== null}
            className={`flex flex-col p-3 bg-black/40 border rounded transition-colors text-left ${attack.color} ${loading === attack.id ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-1 text-gray-400">{attack.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                   <h3 className="text-sm font-semibold text-gray-200">{attack.name}</h3>
                   <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600">{attack.mitre}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{attack.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

