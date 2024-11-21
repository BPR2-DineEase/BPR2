using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
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

    public async Task RegisterUser(User user)
    {
        if (string.IsNullOrEmpty(user.Email))
        {
            throw new ValidationException("Email cannot be null");
        }

        if (string.IsNullOrEmpty(user.Password))
        {
            throw new ValidationException("Password cannot be null");
        }

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
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim(ClaimTypes.Name, user.LastName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Email, user.Email),
        };
        return claims.ToList();
    }
}