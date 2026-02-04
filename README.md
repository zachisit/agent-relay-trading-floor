# Algorithmic Trading Agent Swarm

This repository contains the orchestration logic for a 3-agent trading system (Scanner, Risk, Executor) utilizing the Agent Relay architecture.

## Repository Structure

### 1. Production Agents (`/src/production`)
These files contain the implementation using the actual `@agent-relay/sdk`.
* **Architecture:** Distributed (Microservices)
* **Transport:** TCP / Unix Domain Sockets
* **Status:** Validated backend communication.
* **Files:** `scanner.js`, `risk.js`, `executor.js`

### 2. Stable Simulation (`/src/simulation`)
A monolithic implementation designed for stable demonstrations in restrictive network environments (e.g., Windows/WSL2 without GUI bridging).
* **File:** `safe_demo.js`
* **Usage:** Run `node src/simulation/safe_demo.js` to see the logic flow in a crash-proof loop.

## Setup Notes
* **Runtime:** Node.js v22.22.0 
* **Environment:** WSL2 (Ubuntu 24.04)
* **Optimization:** Workspace moved to native Linux partition (`~/`) to avoid NTFS socket locking issues.
