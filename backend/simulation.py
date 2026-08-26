import asyncio
import random
import time
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

class LogEvent(BaseModel):
    id: str
    timestamp: str
    source: str
    event_type: str
    severity: str
    message: str
    details: Optional[Dict] = None
    mitre_tactic: Optional[str] = None
    mitre_technique_id: Optional[str] = None
    threat_intel: Optional[Dict] = None

def generate_log_id():
    return f"log-{random.randint(1000, 9999)}"

def check_threat_intel(ip: str) -> Optional[Dict]:
    # Mock STIX/TAXII AbuseIPDB check for external IPs
    if ip.startswith("192.168.") or ip.startswith("10.") or ip.startswith("172."):
        return None
    score = random.randint(40, 100)
    return {
        "reputation_score": score,
        "classification": "Known Malicious" if score > 75 else "Suspicious",
        "source": "AlienVault OTX (Simulated)"
    }

def create_ssh_brute_force_log() -> LogEvent:
    users = ["root", "admin", "ubuntu", "test"]
    # 50% chance of external IP for Threat Intel demonstration
    if random.random() > 0.5:
        ip = f"{random.randint(11,254)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}"
    else:
        ips = [f"192.168.1.{random.randint(2, 254)}", f"10.0.0.{random.randint(2,254)}"]
        ip = random.choice(ips)

    success = random.random() > 0.9
    user = random.choice(users)
    msg = f"Failed password for {user} from {ip} port 22 ssh2" if not success else f"Accepted password for {user} from {ip} port 22 ssh2"
    severity = "High" if not success else "Critical"
    return LogEvent(
        id=generate_log_id(),
        timestamp=datetime.utcnow().isoformat() + "Z",
        source="Linux-Target (Auth.log)",
        event_type="Auth",
        severity=severity,
        message=msg,
        details={"user": user, "ip": ip, "success": success},
        mitre_tactic="Credential Access",
        mitre_technique_id="T1110",
        threat_intel=check_threat_intel(ip)
    )

def create_nmap_scan_log() -> LogEvent:
    ports = [22, 80, 443, 3306, 8080]
    # Nmap scans usually from outside for simulation
    ip = f"{random.randint(11,254)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}"
    return LogEvent(
        id=generate_log_id(),
        timestamp=datetime.utcnow().isoformat() + "Z",
        source="Firewall",
        event_type="Network",
        severity="Medium",
        message=f"Connection attempt to multiple ports detected from {ip}",
        details={"source_ip": ip, "target_ports": random.sample(ports, 3)},
        mitre_tactic="Discovery",
        mitre_technique_id="T1046",
        threat_intel=check_threat_intel(ip)
    )

def create_powershell_log() -> LogEvent:
    return LogEvent(
        id=generate_log_id(),
        timestamp=datetime.utcnow().isoformat() + "Z",
        source="Windows-Target (Sysmon)",
        event_type="Process Creation",
        severity="Critical",
        message="Suspicious PowerShell Execution (Encoded Command)",
        details={
            "process_name": "powershell.exe",
            "command_line": "powershell.exe -nop -w hidden -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0AZQBtAG8AcgB5AFMAdAByAGUAYQBtACgAWwBDAG8AbgB2AGUAcgB0AF0AOgA6AEYAcgBvAG0AQgBhAHMAZQA2ADQAUwB0AHIAaQBuAGcAKAAiAEgA..."
        },
        mitre_tactic="Execution",
        mitre_technique_id="T1059.001"
    )

class SimulationManager:
    def __init__(self):
        self.active_simulations = {}
        self.queue = asyncio.Queue()
        
    async def trigger_attack(self, attack_type: str):
        if attack_type == "ssh_brute_force":
            for _ in range(5):
                await self.queue.put(create_ssh_brute_force_log())
                await asyncio.sleep(0.5)
        elif attack_type == "nmap_scan":
            for _ in range(3):
                await self.queue.put(create_nmap_scan_log())
                await asyncio.sleep(1)
        elif attack_type == "powershell_encoded":
            await self.queue.put(create_powershell_log())
        else:
            await self.queue.put(LogEvent(
                id=generate_log_id(),
                timestamp=datetime.utcnow().isoformat() + "Z",
                source="System",
                event_type="Generic",
                severity="Low",
                message=f"Unknown attack type triggered: {attack_type}"
            ))

simulation_manager = SimulationManager()
