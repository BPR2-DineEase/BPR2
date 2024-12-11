using Application.DaoInterfaces;
using Domain.Models;
using EfcDataAccess.Context;
using Microsoft.EntityFrameworkCore;

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
        foreach (var image in images)
        {
            if (image.RestaurantId == 0)  
            {
                throw new Exception("RestaurantId is required for each image.");
            }
            
        }
        _context.Images.AddRange(images);
        await _context.SaveChangesAsync();
    }
    
    public async Task<List<Image>> GetImagesByRestaurantIdAndTypeAsync(int restaurantId, string type)
    {
        var images = await _context.Images
            .Where(img => img.RestaurantId == restaurantId && img.Type.ToLower() == type.ToLower())
            .ToListAsync();
        return images;
    }
}