import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from simulation import simulation_manager
from siem_client import siem_client

app = FastAPI(title="Blue Team Home Lab API")

# Allow all origins for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except WebSocketDisconnect:
                self.disconnect(connection)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    await siem_client.connect()
    
    async def background_log_broadcaster():
        while True:
            log_event = await simulation_manager.queue.get()
            await manager.broadcast(log_event.model_dump_json())
            
    asyncio.create_task(background_log_broadcaster())

@app.get("/")
def read_root():
    return {"status": "Backend is running."}

@app.get("/api/topology")
def get_topology():
    return {
        "nodes": [
            {"id": "attacker", "label": "Kali Attacker", "type": "attacker", "ip": "192.168.1.100"},
            {"id": "win_target", "label": "Windows Target", "type": "target", "ip": "192.168.1.50"},
            {"id": "linux_target", "label": "Linux Target", "type": "target", "ip": "192.168.1.51"},
            {"id": "siem", "label": "Wazuh / Elastic SIEM", "type": "siem", "ip": "192.168.1.10"}
        ],
        "edges": [
            {"source": "attacker", "target": "win_target", "label": "Attacks"},
            {"source": "attacker", "target": "linux_target", "label": "Attacks"},
            {"source": "win_target", "target": "siem", "label": "Logs (Sysmon)"},
            {"source": "linux_target", "target": "siem", "label": "Logs (Auth)"}
        ]
    }

@app.post("/api/simulate/{attack_type}")
async def trigger_simulation(attack_type: str):
    await simulation_manager.trigger_attack(attack_type)
    return {"status": "success", "message": f"Triggered {attack_type} simulation."}

@app.post("/api/rule/evaluate")
async def evaluate_rule(rule: dict):
    # Dummy evaluation
    query = rule.get("query", "")
    if "powershell" in query.lower():
        return {"status": "Match Found", "confidence": "High", "remediation": "Kill malicious powershell.exe process and quarantine host.", "alert_type": "powershell"}
    elif "ssh" in query.lower():
        return {"status": "Match Found", "confidence": "Medium", "remediation": "Block attacking IP at perimeter firewall.", "alert_type": "ssh"}
    elif "nmap" in query.lower():
        return {"status": "Match Found", "confidence": "Low", "remediation": "Drop SYN packets from scanning IP.", "alert_type": "nmap"}
    return {"status": "No Match", "confidence": "None", "remediation": "", "alert_type": "none"}

@app.post("/api/remediate/{alert_type}")
async def trigger_remediation(alert_type: str):
    # Simulated SOAR actions
    if alert_type == "powershell":
        action = "SOAR Playbook Executed: Process 'powershell.exe' (PID 4912) terminated on Windows Target via EDR API."
    elif alert_type == "ssh" or alert_type == "nmap":
        action = "SOAR Playbook Executed: Attacker IP added to FortiGate firewall blocklist."
    else:
        action = "SOAR Playbook Executed: Standard containment."
    
    return {"status": "Success", "action_taken": action}

@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
