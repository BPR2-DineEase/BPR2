using System.Collections;
using System.ComponentModel.DataAnnotations;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Dtos;
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
    
    public async Task<IEnumerable<ReservationWithRestaurantDto>> GetUserReservationsAsync(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ValidationException("UserId cannot be empty.");
        }

        return  await reservationsDao.GetUserReservationsAsync(userId);
    }

    public async Task UpdateReservationAsync(UpdateReservationDto updateReservationDto)
    {
        
        var reservation = await reservationsDao.GetReservationById(updateReservationDto.Id);
        if (reservation == null)
        {
            throw new Exception("Reservation not found.");
        }
        
        reservation.GuestName = updateReservationDto.GuestName;
        reservation.Comments = updateReservationDto.Comments;
        reservation.Date = updateReservationDto.Date;
        reservation.Time = updateReservationDto.Time;
        reservation.NumOfPeople = updateReservationDto.NumOfPeople;

     
        await reservationsDao.UpdateReservationAsync(reservation);
    }

    public async Task DeleteReservationAsync(int id)
    {
        var reservation = await reservationsDao.GetReservationById(id);
        if (reservation == null)
        {
            throw new Exception("Reservation not found.");
        }

        await reservationsDao.DeleteReservationAsync(reservation);
    }
}

