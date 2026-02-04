import { RelayClient } from '@agent-relay/sdk';
const client = new RelayClient({ name: 'Risk' });

client.onMessage = async (msg) => {
    if (msg.source === 'Scanner' || msg.from === 'Scanner') {
        const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
        console.log(`[Risk] 🛡️ Assessing ${data.symbol}...`);

        if (data.sell_pressure > 90) {
            console.log(`[Risk] ❌ REJECTED ${data.symbol}. Falling Knife.`);
            return;
        }
        if (data.sma_dist < -20) {
             console.log(`[Risk] ❌ REJECTED ${data.symbol}. Trend Broken.`);
             return;
        }

        console.log(`[Risk] ✅ APPROVED ${data.symbol}.`);
        await client.sendMessage('Executor', `BUY ${data.symbol} @ $${data.price}`);
    }
};

await client.connect();
console.log("[Risk] Risk Desk Online.");
