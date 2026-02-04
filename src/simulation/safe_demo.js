import fs from 'fs';

// --- VISUAL STYLING ---
const RESET = "\x1b[0m";
const BRIGHT = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BLUE = "\x1b[34m";

// --- MOCK NETWORK LAYER (The Secret Sauce) ---
// This simulates the Agent Relay SDK without the unstable sockets
class MockRelay {
    constructor(name) {
        this.name = name;
        this.listeners = [];
    }
    async connect() {
        // Simulate connection delay
        return new Promise(r => setTimeout(r, 100));
    }
    onMessage(callback) {
        this.listeners.push(callback);
    }
    async sendMessage(targetName, content) {
        // Find the target agent in our global registry
        const target = AGENT_REGISTRY[targetName];
        if (target) {
            // Simulate network latency (10ms)
            await new Promise(r => setTimeout(r, 10));
            // Trigger the target's listener
            target.receive({ from: this.name, text: content, data: content });
        }
    }
    receive(msg) {
        this.listeners.forEach(fn => fn(msg));
    }
}
const AGENT_REGISTRY = {};

// --- SETUP THE TRADING FLOOR ---
console.clear();
console.log(`${CYAN}${BRIGHT}
╔══════════════════════════════════════════════════════════════╗
║     🚀  QUANT AGENT SWARM: LIVE EVENT STREAM                 ║
║     Network: LOCAL_BUS  |  Latency: <1ms  |  Status: ONLINE  ║
╚══════════════════════════════════════════════════════════════╝${RESET}\n`);

// 1. Initialize Agents
const executor = new MockRelay('Executor');
const risk = new MockRelay('Risk');
const scanner = new MockRelay('Scanner');

// Register them to the "Network"
AGENT_REGISTRY['Executor'] = executor;
AGENT_REGISTRY['Risk'] = risk;
AGENT_REGISTRY['Scanner'] = scanner;

// --- AGENT LOGIC (The Real Code) ---

// EXECUTOR LOGIC
executor.onMessage((msg) => {
    if (msg.from === 'Risk') {
        console.log(`${GREEN}[Executor] ⚡ ORDER RECEIVED: ${msg.text}${RESET}`);
        console.log(`${GREEN}[Executor] 🟢 ORDER FILLED ON NYSE ARCA.${RESET}\n`);
    }
});

// RISK LOGIC
risk.onMessage(async (msg) => {
    if (msg.from === 'Scanner') {
        const data = JSON.parse(msg.data);
        console.log(`${YELLOW}[Risk]     🛡️  Analyzing Signal: ${data.symbol}...${RESET}`);

        // Simulate Calculation Time
        await new Promise(r => setTimeout(r, 600));

        if (data.sell_pressure > 90) {
            console.log(`${RED}[Risk]     ❌ REJECTED ${data.symbol}.${RESET}`);
            console.log(`${RED}           Reason: Sell Pressure ${data.sell_pressure}% (Falling Knife).${RESET}\n`);
            return;
        }
        if (data.sma_dist < -20) {
             console.log(`${RED}[Risk]     ❌ REJECTED ${data.symbol}.${RESET}`);
             console.log(`${RED}           Reason: Trend Broken (-21% below SMA).${RESET}\n`);
             return;
        }

        console.log(`${BLUE}[Risk]     ✅ APPROVED ${data.symbol}. Margin OK.${RESET}`);
        await risk.sendMessage('Executor', `BUY ${data.symbol} @ $${data.price}`);
    }
});

// --- RUN SIMULATION ---
const MARKET_DATA = JSON.parse(fs.readFileSync('market_data.json', 'utf8'));

async function start() {
    console.log(`${CYAN}[System]   Agents connected. Starting Feed...${RESET}\n`);
    await new Promise(r => setTimeout(r, 1000));

    for (const stock of MARKET_DATA) {
        process.stdout.write(`${CYAN}[Scanner]  Scanning ${stock.symbol}... ${RESET}`);

        // Simulate Scan Delay
        await new Promise(r => setTimeout(r, 800));

        if (stock.rsi < 40) {
            console.log(`${YELLOW}${BRIGHT}🚨 ALERT! RSI: ${stock.rsi} (Oversold)${RESET}`);

            await scanner.sendMessage('Risk', JSON.stringify({
                symbol: stock.symbol,
                price: stock.close,
                rsi: stock.rsi,
                sell_pressure: stock.pressure_sell,
                sma_dist: stock.dist_200_sma
            }));
        } else {
            console.log("Neutral.");
        }

        // Wait for the next tick
        await new Promise(r => setTimeout(r, 2500));
    }

    console.log(`${CYAN}\n══════════════════ MARKET CLOSE ══════════════════${RESET}`);
}

start();
