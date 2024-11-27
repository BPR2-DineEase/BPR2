using Application.DaoInterfaces;
using Domain.Models;
using EfcDataAccess.Context;

namespace EfcDataAccess.DAOs;

public class ImageDao : IImageDao
{
    private readonly ReservationContext _context;

    public ImageDao(ReservationContext context)
    {
        _context = context;
    }

    public async Task AddImagesAsync(IEnumerable<Image> images)
    {
        _context.Images.AddRange(images);
        await _context.SaveChangesAsync();
    }
}