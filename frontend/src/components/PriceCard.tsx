import { useEffect, useState, useRef, memo } from 'react';

interface PriceCardProps {
  symbol: string;
  price: number;
  alertThreshold?: number; // Kullanıcının belirlediği alarm eşiği
}

export const PriceCard = memo(
  ({ symbol, price, alertThreshold }: PriceCardProps) => {
    const [colorClass, setColorClass] = useState('text-white');
    const [isAlert, setIsAlert] = useState(false);
    const prevPriceRef = useRef<number>(price);

    useEffect(() => {
      // Tek batch'te tüm state güncellemelerini yap (React 18 automatic batching)
      let newColorClass = 'text-white';
      let newIsAlert = false;

      // Fiyat değişimi görseli
      if (price > prevPriceRef.current) {
        newColorClass = 'text-green-400 bg-green-900/10';
      } else if (price < prevPriceRef.current) {
        newColorClass = 'text-red-400 bg-red-900/10';
      }

      // Alarm kontrolü
      if (alertThreshold && price >= alertThreshold) {
        newIsAlert = true;
      }

      // Tek seferde güncelle
      setColorClass(newColorClass);
      setIsAlert(newIsAlert);

      const timeout = setTimeout(() => setColorClass('text-white'), 300);
      prevPriceRef.current = price;
      return () => clearTimeout(timeout);
    }, [price, alertThreshold]);

    return (
      <div
        className={`p-6 rounded-xl border transition-all duration-300 ${
          isAlert
            ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] [will-change:transform]'
            : 'border-gray-700'
        } ${colorClass}`}
        style={isAlert ? { animation: 'shake 0.5s ease-in-out' } : undefined}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            {symbol}
          </h2>
          {isAlert && (
            <span
              className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded"
              style={{ animation: 'pulse-opacity 1s ease-in-out infinite' }}
            >
              ALARM!
            </span>
          )}
        </div>
        <p className="text-3xl font-mono mt-2 font-bold">
          $
          {price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        {alertThreshold && (
          <p className="text-[10px] text-gray-500 mt-2 uppercase">
            Eşik: ${alertThreshold}
          </p>
        )}
      </div>
    );
  },
);
