using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace EfcDataAccess.Context;

public class ReservationContextFactory : IDesignTimeDbContextFactory<ReservationContext>
{
    public ReservationContext CreateDbContext(string[] args)
    {
        Env.Load("../../WebAPI/.env");
        
        var configurationPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "WebAPI");
        
        var configuration = new ConfigurationBuilder()
            .SetBasePath(configurationPath) 
            .AddJsonFile("appsettings.json")
            .Build();
        
        var optionsBuilder = new DbContextOptionsBuilder<ReservationContext>();
        optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("DB_CONNECTION"));

        return new ReservationContext();
    }
}