using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace EfcDataAccess.Context;

public class ReservationContext : DbContext
{
    public DbSet<Reservation> Reservations { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source = ../EfcDataAccess/Reservation.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservation>().HasKey(x => x.Id);
    }
}