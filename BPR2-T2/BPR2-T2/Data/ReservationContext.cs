using BPR2_T2.Models;
using Microsoft.EntityFrameworkCore;

namespace BPR2_T2.Data;


public class ReservationContext : DbContext
{
    public ReservationContext(DbContextOptions<ReservationContext> options) : base(options) { }

    public DbSet<Reservation> Reservations { get; set; }
}
