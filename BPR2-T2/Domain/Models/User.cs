namespace Domain.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; }
    public string? ResetOtp { get; set; }
    public DateTime? OtpExpiry { get; set; }
    public Restaurant Restaurant { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Reservation> Reservations { get; set; }

}