using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mrp.Infrastructure.Data;

namespace Mrp.Infrastructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var dbProvider = configuration.GetValue<string>("DatabaseProvider") ?? "SqlServer";

        services.AddDbContext<MrpDbContext>(options =>
        {
            switch (dbProvider.ToLower())
            {
                case "postgresql":
                    options.UseNpgsql(configuration.GetConnectionString("PostgreConnection"),
                        b => b.MigrationsAssembly("Mrp.Infrastructure"));
                    break;
                
                case "inmemory":
                    options.UseInMemoryDatabase("FactoryMrpDb");
                    break;

                case "sqlserver":
                default:
                    options.UseSqlServer(configuration.GetConnectionString("SqlServerConnection"),
                        b => b.MigrationsAssembly("Mrp.Infrastructure"));
                    break;
            }
        });
            
        return services;
    }
}
