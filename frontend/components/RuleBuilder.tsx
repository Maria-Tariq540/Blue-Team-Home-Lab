"use client";

import { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, Activity } from "lucide-react";

export default function RuleBuilder() {
  const [query, setQuery] = useState('event.category: "process" AND process.name: "powershell.exe" AND process.command_line: "*enc*"');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [remediating, setRemediating] = useState(false);
  const [remediationResult, setRemediationResult] = useState<string | null>(null);

  const evaluateRule = async () => {
    setLoading(true);
    setRemediationResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/rule/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executePlaybook = async (alertType: string) => {
    setRemediating(true);
    try {
      const res = await fetch(`http://localhost:8000/api/remediate/${alertType}`, {
        method: "POST"
      });
      const data = await res.json();
      setRemediationResult(data.action_taken);
    } catch (err) {
      console.error(err);
      setRemediationResult("Failed to execute SOAR playbook.");
    } finally {
      setRemediating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 font-semibold uppercase">Elastic/KQL Query (Mock)</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-24 bg-black/50 border border-gray-700 rounded p-2 text-sm font-mono text-primary focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Enter detection query..."
        />
        <button
          onClick={evaluateRule}
          disabled={loading}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          Evaluate Rule
        </button>
      </div>

      {result && (
        <div className="mt-4 flex-1 border-t border-gray-800 pt-4">
          <h3 className="text-xs text-gray-400 font-semibold uppercase mb-3">Evaluation Results</h3>
          <div className="bg-black/30 border border-gray-800 rounded p-3 text-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Status:</span>
              <span className={result.status === "Match Found" ? "text-accent font-bold" : "text-gray-300"}>
                {result.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Confidence:</span>
              <span className="text-orange-400">{result.confidence}</span>
            </div>
            
            {result.remediation && (
              <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded">
                <div className="flex items-center gap-2 text-accent mb-1 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  Recommended Remediation
                </div>
                <p className="text-gray-300 text-xs mb-3">{result.remediation}</p>
                
                {remediationResult ? (
                   <div className="p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-xs font-mono">
                     <span className="flex items-center gap-1 font-bold mb-1">
                        <CheckCircle2 className="w-3 h-3" /> SOAR Action Completed
                     </span>
                     {remediationResult}
                   </div>
                ) : (
                  <div className="pt-2 border-t border-accent/10 flex items-center gap-2 text-xs">
                    <button 
                      onClick={() => executePlaybook(result.alert_type)}
                      disabled={remediating}
                      className="bg-accent/20 hover:bg-accent/30 text-accent px-3 py-1.5 rounded transition-colors flex items-center gap-1 font-bold"
                    >
                      {remediating ? <Activity className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                      Execute SOAR Playbook
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

