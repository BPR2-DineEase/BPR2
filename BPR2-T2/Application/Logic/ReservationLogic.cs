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

    public async Task<IEnumerable<Reservation>> GetReservationsByRestaurantIdAsync(int restaurantId)
    {
        var reservations = await reservationsDao.GetReservationsByRestaurantIdAsync(restaurantId);
        if (reservations == null)
        {
            throw new Exception("Reservations not found.");
        }
        return reservations;
    }
    
    public async Task<string> SendReservationConfirmationEmailAsync(ReservationDto reservationDto)
    {
        if (reservationDto == null)
        {
            throw new ArgumentException("Reservation details cannot be null.");
        }
        
        var reservation = await AddReservationAsync(reservationDto);
        
        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", reservation.GuestName },
            { "RestaurantName", "Your Restaurant Name" }, 
            { "ReservationDate", reservation.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", reservation.Time },
            { "NumOfPeople", reservation.NumOfPeople.ToString() },
            { "Comments", reservation.Comments },
            { "SupportEmail", "support@restaurant.com" } 
        };
        
        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-confirmation", placeholders);
        
        var emailService = new EmailService();
        await emailService.SendEmailAsync(reservation.Email, "Reservation Confirmation", emailBody);

        return "Reservation confirmation email sent successfully.";
    }
    
    
    public async Task<string> SendReservationUpdateEmailAsync(Reservation reservation)
    {
        if (reservation == null)
        {
            throw new ArgumentException("Reservation details cannot be null.");
        }

        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", reservation.GuestName },
            { "RestaurantName", "Your Restaurant Name" },
            { "ReservationDate", reservation.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", reservation.Time },
            { "NumOfPeople", reservation.NumOfPeople.ToString() },
            { "Comments", reservation.Comments },
            { "SupportEmail", "support@restaurant.com" }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-updated", placeholders);
        var emailService = new EmailService();
        await emailService.SendEmailAsync(reservation.Email, "Reservation Updated", emailBody);

        return "Reservation update email sent successfully.";
    }

    public async Task<string> SendReservationDeletionEmailAsync(Reservation reservation)
    {
        if (reservation == null)
        {
            throw new ArgumentException("Reservation details cannot be null.");
        }

        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", reservation.GuestName },
            { "RestaurantName", "Your Restaurant Name" },
            { "SupportEmail", "support@restaurant.com" }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-deleted", placeholders);
        var emailService = new EmailService();
        await emailService.SendEmailAsync(reservation.Email, "Reservation Canceled", emailBody);

        return "Reservation deletion email sent successfully.";
    }

}

