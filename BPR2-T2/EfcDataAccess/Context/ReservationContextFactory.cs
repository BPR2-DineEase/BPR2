using EfcDataAccess.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;


namespace EfcDataAccess;

public class ReservationContextFactory : IDesignTimeDbContextFactory<ReservationContext>
{
    public ReservationContext CreateDbContext(string[] args)
    {
        
        var configurationPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "WebAPI");
        
        var configuration = new ConfigurationBuilder()
            .SetBasePath(configurationPath) 
            .AddJsonFile("appsettings.json")
            .Build();
        
        var optionsBuilder = new DbContextOptionsBuilder<ReservationContext>();
        optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection"));

        return new ReservationContext(configuration);
    }
}