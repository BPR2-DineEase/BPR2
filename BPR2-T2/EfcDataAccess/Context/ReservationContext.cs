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
            optionsBuilder.UseSqlite(Environment.GetEnvironmentVariable("DB_CONNECTION"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>().HasKey(x => x.Id);
        modelBuilder.Entity<Restaurant>()
            .HasMany(r => r.Images)
            .WithOne(i => i.Restaurant)
            .HasForeignKey(i => i.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade); 
        modelBuilder.Entity<User>().HasKey(x => x.Id);
        modelBuilder.Entity<Image>().HasKey(x => x.Id);
    }
}