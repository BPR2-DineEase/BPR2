using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.Services;

public class ReservationEmailService
{
    public async Task<string> SendReservationConfirmationEmailAsync(Reservation reservation)
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

