using Application.DaoInterfaces;
using Domain.Dtos;
using Domain.Models;
using EfcDataAccess.Context;
using Microsoft.EntityFrameworkCore;

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
    
    public async Task<IEnumerable<ReservationWithRestaurantDto>> GetUserReservationsAsync(Guid userId)
    {
        return await _context.Reservations
            .Where(r => r.UserId == userId)
            .Select(r => new ReservationWithRestaurantDto
            {
                Id = r.Id,
                GuestName = r.GuestName,
                PhoneNumber = r.PhoneNumber,
                Email = r.Email,
                Date = r.Date,
                Time = r.Time,
                NumOfPeople = r.NumOfPeople,
                Comments = r.Comments,
                Restaurant = new RestaurantPreviewDto
                {
                    Name = r.Restaurant.Name,
                    Address = r.Restaurant.Address,
                    City = r.Restaurant.City,
                    OpenHours = r.Restaurant.OpenHours,
                    Cuisine = r.Restaurant.Cuisine,
                    Info = r.Restaurant.Info,
                    Capacity = r.Restaurant.Capacity,
                    Images = r.Restaurant.Images.Select(img => new ImageDto
                    {
                        Id = img.Id,
                        Uri = img.Uri,
                        Name = img.Name,
                        ContentType = img.ContentType,
                        Type = img.Type
                    }).ToList()
                }
            })
            .ToListAsync();
    }
    
    
    
    public async Task UpdateReservationAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteReservationAsync(Reservation reservation)
    {
        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Reservation>> GetReservationsByRestaurantIdAsync(int restaurantId)
    {
        return await _context.Reservations.Include(r => r.Restaurant) 
            .Where(r => r.Restaurant.Id == restaurantId) 
            .ToListAsync();
    }

    
    
}