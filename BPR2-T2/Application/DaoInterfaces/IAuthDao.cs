using Domain.Dtos;
using Domain.Models;

namespace Application.DaoInterfaces;

public interface IAuthDao
{
    Task<User?> GetUserByEmail(string username);
    Task<User> AddUser(User user);
    Task UpdateUserAsync(User user);

    Task<User?> GetUserById(Guid userId);
    Task<User?> GetUserCredentials(UserCredentialsDto userCredentialsDto);
}