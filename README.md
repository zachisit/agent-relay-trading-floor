# 🚀 Agent Relay Trading Swarm

A proof-of-concept for an autonomous, event-driven trading floor using **@agent-relay/sdk**. This project demonstrates a distributed agent architecture where specialized nodes communicate via a message bus to execute high-frequency trade logic.

### ⚡ System Architecture

The swarm consists of three decoupled agents:

1. **Scanner:** Monitors market data feeds (RSI/Price action) and publishes opportunities.
2. **Risk Manager:** Intercepts signals, enforces exposure limits, and filters "falling knife" scenarios.
3. **Executor:** Consumes validated orders from Risk and simulates execution on the exchange.

### 🛠️ Deployment Modes

This repository contains two implementation patterns to address different infrastructure constraints:

* **`/src/production`:** The full microservices implementation using TCP/Unix Sockets. Designed for cloud/Linux native environments.
* **`/src/simulation`:** A monolithic, "headless" implementation (`safe_demo.js`). Designed for demonstration integrity in restrictive network environments (e.g., WSL2/Windows) where socket latency or bridging issues may compromise the event stream.
