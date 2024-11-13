using Application.DaoInterfaces;
using Domain.Dtos.ReservationDtos;
using Domain.Models;
using EfcDataAccess.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace EfcDataAccess.DAOs;

public class ReservationsEfcDao : IReservationsDao
{
    
    private readonly ReservationContext _context;

    public ReservationsEfcDao(ReservationContext context)
    {
        this._context = context;
    }
    
    public async Task<Reservation> CreateReservation(Reservation addReservation)
    {
        
        var reservation = await _context.Reservations.AddAsync(addReservation);
        await _context.SaveChangesAsync();
        return reservation.Entity;
    }

    public async Task<Reservation?> GetReservationById(int id)
    {
        var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);
        await _context.SaveChangesAsync();
        return reservation;
    }

    public async Task<IEnumerable<Reservation>> GetReservations()
    {
        var reservations = await _context.Reservations.ToListAsync();
        await _context.SaveChangesAsync();
        return reservations;
    }
}