using System.Collections;
using System.ComponentModel.DataAnnotations;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.Logic;

public class ReservationLogic : IReservationsLogic
{
    private readonly IReservationsDao reservationsDao;

    public ReservationLogic(IReservationsDao reservationsDao)
    {
        this.reservationsDao = reservationsDao;
    }

    public async Task<Reservation> AddReservationAsync(ReservationDto reservationDto)
    {
      
        var reservation = new Reservation
        {
            GuestName = reservationDto.GuestName,
            PhoneNumber = reservationDto.PhoneNumber,
            Email = reservationDto.Email,
            Company = reservationDto.Company,
            Comments = reservationDto.Comments,
            Date = reservationDto.Date,
            Time = reservationDto.Time,
            NumOfPeople = reservationDto.NumOfPeople,
            UserId = reservationDto.UserId,
            RestaurantId = reservationDto.RestaurantId
        };

        return await reservationsDao.CreateReservation(reservation);
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
    {
        var reservations = await reservationsDao.GetReservations();

        return reservations;
    }

    public async Task<Reservation?> GetReservationByIdAsync(int id)
    {
        var reservation = await reservationsDao.GetReservationById(id);

        return reservation;
    }
    
    public async Task<IEnumerable<ReservationDto>> GetReservationsByUserIdAsync(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ValidationException("UserId cannot be empty.");
        }

        var reservations = await reservationsDao.GetReservationsByUserId(userId);
        return reservations.Select(r => new ReservationDto
        {
            Id = r.Id,
            GuestName = r.GuestName,
            PhoneNumber = r.PhoneNumber,
            Email = r.Email,
            Date = r.Date,
            Time = r.Time,
            NumOfPeople = r.NumOfPeople,
            Comments = r.Comments
        });
    }
}

