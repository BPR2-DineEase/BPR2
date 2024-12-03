using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class EmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;

    public EmailService()
    {
        _smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER") ?? "localhost";
        _smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "25");
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        using (var smtpClient = new SmtpClient(_smtpServer, _smtpPort))
        {
            smtpClient.EnableSsl = true; 

            var mailMessage = new MailMessage
            {
                From = new MailAddress("noreply@dineease.dk", "DineEase"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true 
            };

            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
    
}