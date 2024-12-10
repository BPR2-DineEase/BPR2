using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.Services;

public class ReservationEmailService
{
   public async Task<string> SendReservationConfirmationEmailToGuestAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName },
            { "ReservationDate", notification.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", notification.Time },
            { "NumOfPeople", notification.NumOfPeople.ToString() },
            { "Comments", notification.Comments },
            { "SupportEmail", "support@restaurant.com" }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-confirmation-guest", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.GuestEmail, "Reservation Confirmation", emailBody);

        return "Reservation confirmation email sent to guest successfully.";
    }

    public async Task<string> SendReservationConfirmationEmailToRestaurantOwnerAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "RestaurantOwnerName", notification.RestaurantOwnerName },
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName },
            { "ReservationDate", notification.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", notification.Time },
            { "NumOfPeople", notification.NumOfPeople.ToString() },
            { "Comments", notification.Comments },
            { "SupportEmail", "support@restaurant.com" }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-confirmation-owner", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.RestaurantOwnerEmail, "New Reservation Alert", emailBody);

        return "Reservation confirmation email sent to restaurant owner successfully.";
    }

    public async Task<string> SendReservationUpdateEmailToGuestAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName },
            { "ReservationDate", notification.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", notification.Time },
            { "NumOfPeople", notification.NumOfPeople.ToString() },
            { "Comments", notification.Comments },
            { "SupportEmail", notification.SupportEmail }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-update-guest", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.GuestEmail, "Reservation Updated", emailBody);

        return "Reservation update email sent to guest successfully.";
    }

    public async Task<string> SendReservationUpdateEmailToRestaurantOwnerAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "RestaurantOwnerName", notification.RestaurantOwnerName },
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName },
            { "ReservationDate", notification.Date.ToString("yyyy-MM-dd") },
            { "ReservationTime", notification.Time },
            { "NumOfPeople", notification.NumOfPeople.ToString() },
            { "Comments", notification.Comments },
            { "SupportEmail", notification.SupportEmail }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-update-owner", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.RestaurantOwnerEmail, "Reservation Updated", emailBody);

        return "Reservation update email sent to restaurant owner successfully.";
    }

    public async Task<string> SendReservationDeletionEmailToGuestAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName },
            { "SupportEmail", notification.SupportEmail }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-deletion-guest", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.GuestEmail, "Reservation Canceled", emailBody);

        return "Reservation deletion email sent to guest successfully.";
    }

    public async Task<string> SendReservationDeletionEmailToRestaurantOwnerAsync(ReservationNotificationDto notification)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "RestaurantOwnerName", notification.RestaurantOwnerName },
            { "GuestName", notification.GuestName },
            { "RestaurantName", notification.RestaurantName }, 
            { "ReservationDate", notification.Date.ToString("yyyy-MM-dd") }, 
            { "ReservationTime", notification.Time },
            { "NumOfPeople", notification.NumOfPeople.ToString() }, 
            { "SupportEmail", notification.SupportEmail }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("reservation-deletion-owner", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(notification.RestaurantOwnerEmail, "Reservation Canceled", emailBody);

        return "Reservation deletion email sent to restaurant owner successfully.";
    }
}

