namespace VocabJourney
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // =======================================================
            // BƯỚC 1: KHAI BÁO CORS (Cấp thẻ khách VIP cho cổng 5173)
            // =======================================================
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ChoPhepReact", policy =>
                {
                    policy.WithOrigins("http://localhost:5173") // Cổng của React
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // =======================================================
            // BƯỚC 2: KÍCH HOẠT CORS (Mở cửa cho React vào)
            // LƯU Ý: Bắt buộc phải đứng trên dòng app.UseAuthorization()
            // =======================================================
            app.UseCors("ChoPhepReact");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}