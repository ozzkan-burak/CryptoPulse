import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

// Backend'den gelecek veri yapısı (C# tarafıyla aynı olmalı)
interface Coin {
  symbol: string;
  price: number;
}

interface MarketData {
  timestamp: string;
  coins: Coin[];
}

export const useSignalR = () => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Bağlantıyı inşa et
    // Backend'deki MapHub("/hubs/crypto") adresiyle birebir aynı olmalı
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5008/hubs/crypto', {
        skipNegotiation: true, // Pazarlığı atla - WebSocket direkt
        transport: signalR.HttpTransportType.WebSockets, // Doğrudan WebSocket kullan
      })
      // MessagePack skipNegotiation ile uyumlu değil - JSON kullanıyoruz
      .withAutomaticReconnect()
      .build();

    // 3. Backend'den gelecek "ReceiveMarketUpdate" olayını dinle
    // (start() çağrılmadan önce on() listener'ı kaydet)
    connection.on('ReceiveMarketUpdate', (marketData: MarketData) => {
      setData(marketData);
    });

    // 2. Bağlantıyı başlat
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        console.log('✅ SignalR Tüneli Açıldı!');
      })
      .catch((err) => console.error('❌ Bağlantı Hatası: ', err));

    // 4. Component kapandığında bağlantıyı temizle (Memory leak önlemi)
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, []);

  return { data, isConnected };
};
