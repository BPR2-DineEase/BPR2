using Domain.Models;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EfcDataAccess.Context;

public class ReservationContext : DbContext
{

    public ReservationContext()
    {
        Env.Load("../WebAPI/.env");
    }

    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Image> Images { get; set; } 

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var conn = Environment.GetEnvironmentVariable("DB_CONNECTION");
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(conn);
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
        modelBuilder.Entity<Image>(entity =>
        {
            entity.Property(i => i.Id)
                .HasDefaultValueSql("NEWID()")
                .HasColumnType("UNIQUEIDENTIFIER"); 
        });
    }
}