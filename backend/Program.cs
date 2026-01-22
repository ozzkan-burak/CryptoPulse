var builder = WebApplication.CreateBuilder(args);

// 1. Servisler - PERFORMANS OPTİMİZASYONU
builder.Services.AddSignalR(options =>
{
    // WebSocket öncelikli yapılandırma
    options.EnableDetailedErrors = false; // Production'da false olmalı (güvenlik)
    options.KeepAliveInterval = TimeSpan.FromSeconds(10); // Bağlantı canlılığı kontrolü
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(20); // Client timeout
    options.HandshakeTimeout = TimeSpan.FromSeconds(5); // Handshake zaman aşımı
    options.MaximumParallelInvocationsPerClient = 1; // Eşzamanlı çağrı limiti
    options.StreamBufferCapacity = 10; // Stream buffer boyutu
}); // MessagePack skipNegotiation ile uyumlu değil - JSON kullanıyoruz

builder.Services.AddHostedService<CryptoPulse.API.Services.PriceSimulatorService>();

// CORS - Güvenlik İyileştirmesi
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // SetIsOriginAllowed kaldırıldı (güvenlik riski)
    });
});

var app = builder.Build();

// 2. Middleware Sıralaması (HAYATİ ÖNEMDE)
app.UseCors("AllowFrontend"); // CORS

// Endpoint Mapping (Modern .NET 6+ yaklaşımı)
app.MapHub<CryptoPulse.API.Hubs.CryptoHub>("/hubs/crypto");
app.MapGet("/", () => "API is running...");

app.Run();