"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, ShieldAlert } from "lucide-react";

export type LogEvent = {
  id: string;
  timestamp: string;
  source: string;
  event_type: string;
  severity: string;
  message: string;
  details?: any;
  mitre_tactic?: string;
  mitre_technique_id?: string;
  threat_intel?: {
    reputation_score: number;
    classification: string;
    source: string;
  };
};

export default function LogStreamer({ onLogsUpdated }: { onLogsUpdated?: (logs: LogEvent[]) => void }) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/logs");
    
    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data) as LogEvent;
        setLogs((prev) => {
          const newLogs = [...prev.slice(-49), log];
          if (onLogsUpdated) onLogsUpdated(newLogs);
          return newLogs;
        });
      } catch (err) {
        console.error("Failed to parse log", err);
      }
    };

    return () => ws.close();
  }, [onLogsUpdated]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "text-accent";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="h-full bg-black font-mono text-[11px] sm:text-xs overflow-y-auto p-2 relative">
      {logs.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
          <Terminal className="w-6 h-6" />
          <span>Listening for telemetry...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {logs.map((log) => (
            <div key={log.id} className="border-b border-gray-900/50 pb-1 mb-1 break-words">
              <span className="text-gray-500">[{log.timestamp}]</span>{" "}
              <span className="text-purple-400">[{log.source}]</span>{" "}
              <span className={`font-bold ${getSeverityColor(log.severity)}`}>[{log.severity}]</span>{" "}
              <span className="text-gray-300">{log.message}</span>
              
              {log.mitre_technique_id && (
                <span className="ml-2 text-[10px] bg-accent/20 text-accent px-1 rounded inline-block">
                  {log.mitre_technique_id} ({log.mitre_tactic})
                </span>
              )}
              
              {log.threat_intel && (
                <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-400 px-1 rounded flex items-center inline-flex gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  STIX: {log.threat_intel.classification} (Score: {log.threat_intel.reputation_score})
                </span>
              )}

              {log.details && (
                <div className="pl-4 mt-1 text-gray-500">
                  {JSON.stringify(log.details)}
                </div>
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
