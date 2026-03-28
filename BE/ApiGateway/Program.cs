using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Yêu cầu hệ thông nạp cấu hình từ file ocelot.json 
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true); 

// Đăng ký dịch vụ ocelot
builder.Services.AddOcelot(builder.Configuration);
var app = builder.Build();

app.MapGet("/", () => "Hello from API Gateway!");

// 3. Sử dụng Middleware của Ocelot (Phải dùng await) 
await app.UseOcelot();
app.Run(); 
