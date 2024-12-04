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
        return await _context.Reservations
            .Include(r => r.Restaurant) 
            .Include(r => r.User)     
            .ToListAsync();
    }
    
    public async Task<IEnumerable<Reservation>> GetReservationsByUserId(Guid userId)
    {
        return await _context.Reservations
            .Where(r => r.UserId == userId)
            .ToListAsync();
    }
}