namespace Application.Services;

public class AuthEmailService
{
    public async Task SendPasswordResetEmailAsync(string email, string otp, string resetLink, string lastName)
    {
        var placeholders = new Dictionary<string, string>
        {
            { "Name", lastName },
            { "OTP", otp },
            { "ResetLink", resetLink }
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("password-reset", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(email, "Password Reset OTP", emailBody);
    }
}