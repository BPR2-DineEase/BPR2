using Application.DaoInterfaces;
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
            .FirstOrDefaultAsync(u => EF.Functions.Like(u.Email, email));
        return user;
    }
}