import { RelayClient } from '@agent-relay/sdk';
const client = new RelayClient({ name: 'Executor' });

client.onMessage = async (msg) => {
    // Filter for Risk messages
    if (msg.source === 'Risk' || msg.from === 'Risk') {
        const text = msg.data || msg.text || msg.content;
        console.log(`[Exec] ⚡ ORDER RECEIVED: ${text}`);
        console.log(`[Exec] 🟢 ORDER FILLED on Exchange.`);
    }
};

await client.connect();
console.log("[Exec] Execution Algo Ready.");
