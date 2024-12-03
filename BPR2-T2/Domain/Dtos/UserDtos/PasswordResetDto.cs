namespace Domain.Dtos;

public class PasswordResetDto
{
    public string Email { get; init; }
    public string Otp { get; init; }
    public string NewPassword { get; init; }
}