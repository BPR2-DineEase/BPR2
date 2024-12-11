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
    Task<User> GetUserByEmail(string email);
    Task<User?> GetUserById(Guid userId);
    Task<User?> GetUserCredentials(UserCredentialsDto userCredentialsDto);

    Task<User> addRestaurantToUser(Guid userId, int restaurantId);
}