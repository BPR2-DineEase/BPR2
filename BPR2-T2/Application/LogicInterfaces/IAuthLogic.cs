using Domain.Dtos;
using Domain.Models;

namespace Application.LogicInterfaces;

public interface IAuthLogic
{
    Task<User> ValidateUser(string username, string password);
    Task RegisterUser(UserRegisterDto userRegisterDto);
    Task<string> LoginUser(string email, string password);
    Task<string> GeneratePasswordResetOtp(string email);
    Task ResetPassword(PasswordResetDto resetDto);
}