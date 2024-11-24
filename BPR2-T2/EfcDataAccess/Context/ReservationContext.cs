using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EfcDataAccess.Context;

public class ReservationContext : DbContext
{
    private readonly IConfiguration _configuration;

    public ReservationContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Image> Images { get; set; } 

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>().HasKey(x => x.Id);
        modelBuilder.Entity<Restaurant>().HasKey(x => x.Id);
        modelBuilder.Entity<User>().HasKey(x => x.Id);
        modelBuilder.Entity<Image>().HasKey(x => x.Id);
    }
}