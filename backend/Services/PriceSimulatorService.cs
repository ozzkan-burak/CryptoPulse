using CryptoPulse.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CryptoPulse.API.Services;

// BackgroundService: Uygulama başladığında ayağa kalkar ve uygulama kapanana kadar çalışır.
public class PriceSimulatorService : BackgroundService
{
  private readonly IHubContext<CryptoHub> _hubContext;
  private readonly Random _random = Random.Shared; // .NET 6+ thread-safe Random

  // Başlangıç fiyatları (Dolar bazında)
  private double _btcPrice = 45000;
  private double _ethPrice = 2800;
  private double _solPrice = 120;

  // Tünelin girişini (HubContext) buraya enjekte ediyoruz
  public PriceSimulatorService(IHubContext<CryptoHub> hubContext)
  {
    _hubContext = hubContext;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    Console.WriteLine("🚀 Piyasa Simülasyonu Başladı! Fiyatlar akıyor...");

    while (!stoppingToken.IsCancellationRequested)
    {
      // 1. Yeni fiyatları hesapla (Random Walk Algoritması)
      // Fiyat %0.5 oranında artabilir veya azalabilir
      UpdatePrice(ref _btcPrice);
      UpdatePrice(ref _ethPrice);
      UpdatePrice(ref _solPrice);

      // 2. Veri paketini hazırla
      var marketData = new
      {
        Timestamp = DateTime.UtcNow,
        Coins = new[]
          {
                    new { Symbol = "BTC", Price = _btcPrice },
                    new { Symbol = "ETH", Price = _ethPrice },
                    new { Symbol = "SOL", Price = _solPrice }
                }
      };

      // 3. TÜNELE BAS! (Tüm bağlı istemcilere gönder)
      // React tarafında "ReceiveMarketUpdate" adıyla dinleyeceğiz
      await _hubContext.Clients.All.SendAsync("ReceiveMarketUpdate", marketData, stoppingToken);

      // 4. Hız kontrolü (High Frequency Trading Simülasyonu)
      // 200ms bekliyoruz (Saniyede 5 güncelleme) - İstersen 50ms yapıp çılgınlaştırabilirsin :)
      await Task.Delay(200, stoppingToken);
    }
  }

  // Fiyatı rastgele değiştiren basit matematik
  private void UpdatePrice(ref double currentPrice)
  {
    var volatility = 0.002; // %0.2 oynaklık
    var change = _random.NextDouble() * 2 - 1; // -1 ile +1 arası sayı
    currentPrice += currentPrice * change * volatility;

    // Fiyat eksiye düşmesin (Olmaz ama önlem)
    if (currentPrice < 0) currentPrice = 1;
  }
}