using Microsoft.AspNetCore.Mvc;
using Mrp.Infrastructure; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// AI Advisor servisi
builder.Services.AddScoped<Mrp.AI.Services.MrpAdvisor>(sp => 
    new Mrp.AI.Services.MrpAdvisor(builder.Configuration["OpenAI:ApiKey"] ?? "")
);

// MRP Engine servisi (stateless olduğu için transient olabilir)
builder.Services.AddScoped<Mrp.Engine.Services.MrpCalculationService>();

// CORS for Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Next.js port
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
