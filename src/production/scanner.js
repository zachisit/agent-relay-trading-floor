import { RelayClient } from '@agent-relay/sdk';
import fs from 'fs';

const client = new RelayClient({ name: 'Scanner' });
const MARKET_DATA = JSON.parse(fs.readFileSync('market_data.json', 'utf8'));

await client.connect();
console.log("[Scanner] 📡 Connected. Scanning...");

// Small delay to ensure peers are ready
await new Promise(r => setTimeout(r, 2000));

for (const stock of MARKET_DATA) {
    console.log(`[Scanner] Analyzing ${stock.symbol}...`);

    if (stock.rsi < 40) {
        console.log(`[Scanner] 🚨 ALERT: ${stock.symbol} Oversold!`);
        await client.sendMessage('Risk', JSON.stringify({
            symbol: stock.symbol,
            price: stock.close,
            rsi: stock.rsi,
            sell_pressure: stock.pressure_sell,
            sma_dist: stock.dist_200_sma
        }));
    }
    // Wait 3 seconds between trades
    await new Promise(r => setTimeout(r, 3000));
}

console.log("[Scanner] Scan Complete.");
process.exit(0);
