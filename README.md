# 🛡️ Blue Team Home Lab & Threat Detection Dashboard

<p align="center">
  <b>Full-Stack SOC Simulation & Threat Detection Platform</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/FastAPI-005571?logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python" />
  <img src="https://img.shields.io/badge/WebSockets-Realtime-success" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
</p>

## 📌 Overview

**Blue Team Home Lab & Threat Detection Dashboard** is a full-stack SOC simulation platform designed to demonstrate practical **Blue Team, SIEM, threat detection, and incident response** workflows.

The platform simulates a virtual security environment where attacks generate telemetry, events are streamed to a live SIEM dashboard, detection rules identify suspicious activity, and remediation playbooks can be triggered in response.

### Core Workflow

**Attack Simulation → Telemetry → Detection → Investigation → Remediation**

---

## ⚡ Key Features

* 🌐 **Interactive Lab Topology** — Kali attacker, target VMs, and SIEM server
* ⚔️ **Attack Simulation** — SSH brute-force, Nmap scanning, malicious PowerShell
* 📡 **Real-Time SIEM** — Live security event streaming using WebSockets
* 🚨 **Threat Detection** — KQL/Sigma-based detection logic
* 🛠️ **Remediation Builder** — Detection-linked incident response playbooks
* 📊 **Security Dashboard** — Severity-based event monitoring and SOC workflows

---

## 🏗️ Architecture

```text
Kali / Attack Simulation
          ↓
     Target VMs
          ↓
   Security Telemetry
          ↓
   FastAPI Backend
          ↓
   WebSocket Stream
          ↓
   Next.js SOC Dashboard
          ↓
 Detection Rules
          ↓
 Remediation Playbooks
```

---

## 🛠️ Tech Stack

| Layer          | Technologies                                          |
| -------------- | ----------------------------------------------------- |
| Frontend       | Next.js 14, TypeScript, Tailwind CSS, Lucide Icons    |
| Backend        | FastAPI, Python 3.11, WebSockets                      |
| Infrastructure | Docker, Docker Compose                                |
| Security       | SIEM, KQL, Sigma, Threat Detection, Incident Response |

---

## 🚀 Quick Start

### Prerequisites

* Docker
* Docker Compose
* Git

### Run the Application

```bash
git clone https://github.com/Maria-Tariq540/Blue-Team-Home-Lab.git
cd Blue-Team-Home-Lab

docker-compose up --build
```

Open the dashboard:

```text
http://localhost:3000
```

To stop the environment:

```bash
docker-compose down
```

---

## 🎯 Security Skills Demonstrated

This project demonstrates hands-on experience with:

* Security monitoring & SIEM workflows
* Log analysis and event correlation
* Threat detection engineering
* Attack simulation
* Incident triage
* Automated remediation
* Real-time security telemetry
* Full-stack security tooling
* Docker-based infrastructure

---

## 💼 Career Relevance

Built as a practical cybersecurity portfolio project targeting **SOC Analyst, Security Analyst, Detection Engineer, and Cybersecurity Engineer** roles.

The project demonstrates the ability to combine **defensive security concepts with full-stack software engineering** to build functional security tooling.

---

## 🔐 Ethical Use

This project is intended strictly for **authorized security testing, cybersecurity education, and isolated lab environments**.

Do not use attack simulations against systems or networks without explicit authorization.

---

## 👩‍💻 Author

**Maria Tariq**

Cybersecurity | Blue Team | Security Engineering

[GitHub](https://github.com/Maria-Tariq540)
