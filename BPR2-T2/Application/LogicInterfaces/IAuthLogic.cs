using Domain.Models;

namespace Application.LogicInterfaces;

public interface IAuthLogic
{
    Task<User> ValidateUser(string username, string password);
    Task RegisterUser(User user);
    
    Task<string> LoginUser(string email, string password);
}