using System.ComponentModel.DataAnnotations;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Models;


namespace Application.Logic;

public class AuthLogic : IAuthLogic
{
    private readonly IAuthDao authDao;

    public AuthLogic(IAuthDao authDao)
    {
        this.authDao = authDao;
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
}
