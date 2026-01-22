using Microsoft.AspNetCore.SignalR;

namespace CryptoPulse.API.Hubs;

// Hub sınıfından miras alarak burayı bir WebSocket terminaline çeviriyoruz.
public class CryptoHub : Hub
{
  // Bir kullanıcı (React) bağlandığında burası çalışır
  public override async Task OnConnectedAsync()
  {
    // Konsola log atalım ki terminalden takip edebilelim
    Console.WriteLine($"🔌 Yeni Bağlantı: {Context.ConnectionId}");
    await base.OnConnectedAsync();
  }

  // Bir kullanıcı koptuğunda (Sekmeyi kapattığında) burası çalışır
  public override async Task OnDisconnectedAsync(Exception? exception)
  {
    Console.WriteLine($"❌ Bağlantı Koptu: {Context.ConnectionId}");
    await base.OnDisconnectedAsync(exception);
  }
}