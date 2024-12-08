using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Application.Services;
using Domain.Dtos;
using Domain.Models;
using Microsoft.IdentityModel.Tokens;


namespace Application.Logic;

public class AuthLogic : IAuthLogic
{
    private readonly IAuthDao authDao;
    private readonly string? _jwtKey;
    private readonly string? _jwtIssuer;
    private readonly string? _jwtAudience;
    private readonly string? _jwtSubject;

    public AuthLogic(IAuthDao authDao)
    {
        this.authDao = authDao;
        _jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        _jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        _jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        _jwtSubject = Environment.GetEnvironmentVariable("JWT_SUBJECT");
    }

    public async Task<User> ValidateUser(string email, string password)
    {
        User? existingUser = await authDao.GetUserByEmail(email);
        if (existingUser == null)
        {
            throw new Exception("User not found");
        }

        if (!existingUser.Password.Equals(password))
        {
            throw new Exception("Password incorrect");
        }

        return existingUser;
    }

    public async Task RegisterUser(UserRegisterDto userRegisterDto)
    {
        var existingUser = await authDao.GetUserByEmail(userRegisterDto.Email);
        if (existingUser != null)
        {
            throw new ValidationException($"User with email {userRegisterDto.Email} already exists.");
        }

        var user = new User
        {
            Id = userRegisterDto.Id,
            Email = userRegisterDto.Email,
            Password = userRegisterDto.Password,
            FirstName = userRegisterDto.FirstName,
            LastName = userRegisterDto.LastName,
            Role = userRegisterDto.Role
        };
        await authDao.AddUser(user);
    }

    public async Task<string> LoginUser(string email, string password)
    {
        User user = await ValidateUser(email, password);
        return GenerateJwt(user);
    }

    private string GenerateJwt(User user)
    {
        List<Claim> claims = GenerateClaims(user);

        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        SigningCredentials signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        JwtHeader header = new JwtHeader(signIn);

        JwtPayload payload = new JwtPayload(
            _jwtIssuer,
            _jwtAudience,
            claims,
            null,
            DateTime.UtcNow.AddMinutes(60));

        JwtSecurityToken token = new JwtSecurityToken(header, payload);

        string serializedToken = new JwtSecurityTokenHandler().WriteToken(token);
        return serializedToken;
    }

    private List<Claim> GenerateClaims(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, _jwtSubject ?? "DefaultSubject"),
            new Claim(ClaimTypes.Name, user.LastName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("id", user.Id.ToString())
        };
        return claims.ToList();
    }

    public async Task<string> GeneratePasswordResetOtp(string email)
    {
        var user = await authDao.GetUserByEmail(email);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var random = new Random();
        string otp = random.Next(100000, 999999).ToString();

        user.ResetOtp = otp;
        user.OtpExpiry = DateTime.UtcNow.AddMinutes(10);
        await authDao.UpdateUserAsync(user);


        string resetLink = $"http://localhost/reset-password";
        var placeholders = new Dictionary<string, string>
        {
            {"Name", user.LastName},
            {"OTP", otp},
            {"ResetLink", resetLink}
        };

        string emailBody = EmailTemplateProcessor.LoadTemplate("password-reset", placeholders);

        var emailService = new EmailService();
        await emailService.SendEmailAsync(user.Email, "Password Reset OTP  ", emailBody);

        return "A password reset email has been sent to your address.";
    }

    public async Task ResetPassword(PasswordResetDto resetDto)
    {
        var user = await authDao.GetUserByEmail(resetDto.Email);
        if (user == null || user.ResetOtp != resetDto.Otp || user.OtpExpiry < DateTime.UtcNow)
        {
            throw new Exception("Invalid or expired token");
        }

        user.Password = resetDto.NewPassword;
        user.ResetOtp = null;
        user.OtpExpiry = null;
        await authDao.UpdateUserAsync(user);
    }

    public async Task<User> GetUserByEmail(string email)
    {
        var user = await authDao.GetUserByEmail(email);
        if (user == null) throw new Exception("User not found");

        return await Task.FromResult(user);
    }

    public async Task<User?> GetUserById(Guid userId)
    {
        var user = await authDao.GetUserById(userId);
        if (user == null) throw new Exception("User not found");

        return await Task.FromResult(user);
    }

    public async Task<User?> GetUserCredentials(UserCredentialsDto userCredentialsDto)
    {
        var user = await authDao.GetUserCredentials(userCredentialsDto);
        if (user == null) throw new Exception("User not found");
        if (user.Email != userCredentialsDto.Email) throw new Exception("Invalid credentials");
        if (user.Role != userCredentialsDto.Role) throw new Exception("Invalid credentials");
        if (user.FirstName != userCredentialsDto.FirstName) throw new Exception("Invalid credentials");
        if (user.LastName != userCredentialsDto.LastName) throw new Exception("Invalid credentials");

        return await Task.FromResult(user);
    }

    public async Task<User> addRestaurantToUser(Guid userId, int restaurantId)
    {
        Console.WriteLine(userId);
        Console.WriteLine(restaurantId);
        if (restaurantId <= 0) throw new Exception("Invalid restaurantId");
        if (userId == Guid.Empty) throw new Exception("Invalid userId");
        return await authDao.addRestaurantToUser(userId, restaurantId);
    }
}