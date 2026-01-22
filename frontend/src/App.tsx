// App.tsx içeriğini bu performanslı versiyonla değiştir
import { useState, useEffect, useRef } from 'react';
import { useSignalR } from './hooks/useSignalR';
import { PriceCard } from './components/PriceCard';
import { LiveChart } from './components/LiveChart';
import { LogPanel } from './components/LogPanel';

interface PricePoint {
  time: string;
  price: number;
}

type HistoryMap = Record<string, PricePoint[]>;

function App() {
  const { data } = useSignalR();
  const [history, setHistory] = useState<HistoryMap>({});
  const [logs, setLogs] = useState<string[]>([]);
  const prevDataRef = useRef<typeof data>(null);

  useEffect(() => {
    if (!data || data === prevDataRef.current) return;

    prevDataRef.current = data;

    // Tek seferde her iki state'i güncelle (Batching optimization)
    const newHistory: HistoryMap = {};
    const coinPrices: string[] = [];

    data?.coins?.forEach((coin) => {
      const currentPoints = history[coin.symbol] || [];
      newHistory[coin.symbol] = [
        ...currentPoints,
        { time: '', price: coin.price },
      ].slice(-30);

      coinPrices.push(`${coin.symbol}: $${coin.price.toFixed(2)}`);
    });

    setHistory((prev) => ({ ...prev, ...newHistory }));

    const logMessage = coinPrices.join(' | ');
    setLogs((prev) => [logMessage, ...prev].slice(0, 10));
  }, [data, history]);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8 font-sans">
      {/* Header Kısmı Aynı Kalabilir */}

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.coins?.map((coin) => {
            // Coin'e özel alert threshold'lar
            const thresholds: Record<string, number> = {
              BTC: 46000,
              ETH: 2850,
              SOL: 125,
            };

            return (
              <div
                key={coin.symbol}
                className="bg-[#181a20] rounded-2xl border border-gray-800 p-1"
              >
                <PriceCard
                  symbol={coin.symbol}
                  price={coin.price}
                  alertThreshold={thresholds[coin.symbol]}
                />
                <LiveChart
                  data={history[coin.symbol] || []}
                  color={coin.symbol === 'BTC' ? '#F7931A' : '#627EEA'}
                />
              </div>
            );
          })}
        </div>

        {/* Yeni Log Paneli */}
        <LogPanel logs={logs} />
      </main>
    </div>
  );
}

export default App;
