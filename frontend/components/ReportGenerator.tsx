"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LogEvent } from "./LogStreamer";

export default function ReportGenerator({ logs }: { logs: LogEvent[] }) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.setTextColor(255, 0, 60); // Accent color
      doc.text("Incident Executive Summary Report", 14, 22);
      
      // Meta
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toISOString()}`, 14, 30);
      doc.text(`Total Events Captured: ${logs.length}`, 14, 36);

      // MITRE Tactics Seen
      const tactics = Array.from(new Set(logs.filter(l => l.mitre_technique_id).map(l => `${l.mitre_technique_id} (${l.mitre_tactic})`)));
      doc.text(`MITRE Techniques Detected: ${tactics.length ? tactics.join(", ") : "None"}`, 14, 42);

      // Table Data
      const tableData = logs.map(log => [
        log.timestamp.split("T")[1].replace("Z", ""),
        log.severity,
        log.event_type,
        log.source,
        log.mitre_technique_id || "-",
        log.message.substring(0, 50) + "..."
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['Time', 'Severity', 'Type', 'Source', 'MITRE ID', 'Message']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [40, 40, 40] },
        styles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });

      doc.save("incident-report.pdf");
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const exportCSV = () => {
    const header = ["ID,Timestamp,Source,Type,Severity,MITRE_ID,Message"];
    const rows = logs.map(l => 
      `${l.id},${l.timestamp},"${l.source}",${l.event_type},${l.severity},${l.mitre_technique_id || ""},"${l.message}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + header.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "incident-logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={exportPDF}
        disabled={exporting || logs.length === 0}
        className="flex items-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 px-3 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        Export PDF
      </button>
      <button 
        onClick={exportCSV}
        disabled={logs.length === 0}
        className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 px-3 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
}
