using System.Collections;
using System.ComponentModel.DataAnnotations;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Application.Services;
using Domain.Dtos;
using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.Logic;

public class ReservationLogic : IReservationsLogic
{
    private readonly IReservationsDao reservationsDao;
    private readonly ReservationEmailService reservationEmailService;
    private readonly IAuthDao authDao;

    public ReservationLogic(IReservationsDao reservationsDao, ReservationEmailService reservationEmailService,   IAuthDao authDao)
    {
        this.reservationsDao = reservationsDao;
        this.reservationEmailService = reservationEmailService;
        this.authDao = authDao;
    }

    public async Task<Reservation> AddReservationAsync(ReservationDto reservationDto)
    {
        if (reservationDto == null)
        {
            throw new ArgumentException("Reservation details cannot be null.");
        }

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

    public async Task<IEnumerable<Reservation>> GetReservationsByRestaurantIdAsync(int restaurantId)
    {
        var reservations = await reservationsDao.GetReservationsByRestaurantIdAsync(restaurantId);
        if (reservations == null)
        {
            throw new Exception("Reservations not found.");
        }
        return reservations;
    }
    
    public async Task<ReservationNotificationDto> CreateReservationNotificationDto(Reservation reservation)
    {
        if (reservation == null)
        {
            throw new Exception("Reservation cannot be null.");
        }
        
        return await reservationsDao.CreateReservationNotificationDto(reservation);
    }
    
    public async Task<string> SendReservationConfirmationEmailsAsync(ReservationNotificationDto notification)
    {
        if (notification == null)
        {
            throw new Exception("Notification details cannot be null.");
        }
        
        await reservationEmailService.SendReservationConfirmationEmailToGuestAsync(notification);
        await reservationEmailService.SendReservationConfirmationEmailToRestaurantOwnerAsync(notification);

        return "Reservation confirmation emails sent successfully to guest and restaurant owner.";
    }

    public async Task<string> SendReservationUpdateEmailAsync(Reservation reservation)
    {
        if (reservation == null)
        {
            throw new Exception("Reservation details cannot be null.");
        }

        var notification = await CreateReservationNotificationDto(reservation);
        
        await reservationEmailService.SendReservationUpdateEmailToGuestAsync(notification);
        await reservationEmailService.SendReservationUpdateEmailToRestaurantOwnerAsync(notification);
        
        return "Reservation update emails attempt completed for guest and restaurant owner.";
    }

    public async Task<string> SendReservationDeletionEmailAsync(Reservation reservation)
    {
        if (reservation == null)
        {
            throw new Exception("Reservation details cannot be null.");
        }

        var notification = await CreateReservationNotificationDto(reservation);
     
        await reservationEmailService.SendReservationDeletionEmailToGuestAsync(notification);
        await reservationEmailService.SendReservationDeletionEmailToRestaurantOwnerAsync(notification);
     
        return "Reservation deletion emails attempt completed for guest and restaurant owner.";
    }

}

