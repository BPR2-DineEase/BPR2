using Application.DaoInterfaces;
using Domain.Dtos;
using Domain.Models;
using EfcDataAccess.Context;
using Microsoft.EntityFrameworkCore;

namespace EfcDataAccess.DAOs;

public class AuthEfcDao : IAuthDao
{
    private readonly ReservationContext _context;

    public AuthEfcDao(ReservationContext context)
    {
        _context = context;
    }

    public async Task<User> AddUser(User user)
    {
        var entity = await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return entity.Entity;
    }

    public async Task<User?> GetUserByEmail(string email)
    {
        var user = await _context.Users
            .Include(u => u.Restaurant)
            .FirstOrDefaultAsync(u => EF.Functions.Like(u.Email, email));
        return user;
    }


    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetUserById(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Id == userId);

        return user;
    }

    public async Task<User?> GetUserCredentials(UserCredentialsDto userCredentialsDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(user =>
            user.Email.Equals(userCredentialsDto.Email) || user.Email.Equals(userCredentialsDto.Email) ||
            user.FirstName.Equals(userCredentialsDto.FirstName) || user.LastName.Equals(userCredentialsDto.LastName));

        return user;
    }
}