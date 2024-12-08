using Application.DaoInterfaces;
using Domain.Dtos;
using Domain.Models;
using EfcDataAccess.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EfcDataAccess.DAOs;

public class RestaurantEfcDao : IRestaurantsDao
{
    private readonly ReservationContext _context;

    public RestaurantEfcDao(ReservationContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Restaurant>> RestaurantFilterByCuisine(string cuisine)
    {
        var cuisines = await _context.Restaurants
            .Where(x => EF.Functions.Like(x.Cuisine, $"%{cuisine}%")) 
            .ToListAsync();

        return cuisines; 
    }
    
    public async Task<IEnumerable<Restaurant>> SearchByCity(string city)
    {
        var cities = await _context.Restaurants
            .Where(x => EF.Functions.Like(x.City, $"%{city}%")) 
            .ToListAsync();

        return cities;
    }
    
    public async Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter)
    {
        var filteredRestaurants = _context.Restaurants.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            filteredRestaurants = filteredRestaurants
                .Where(r => EF.Functions.Like(r.Name, $"%{filter.Name}%"));
        }
        
        if (!string.IsNullOrWhiteSpace(filter.Cuisine))
        {
            filteredRestaurants = filteredRestaurants
                .Where(r => EF.Functions.Like(r.Cuisine, $"%{filter.Cuisine}%"));
        }
        
        if (!string.IsNullOrWhiteSpace(filter.City))
        {
            filteredRestaurants = filteredRestaurants
                .Where(r => EF.Functions.Like(r.City, $"%{filter.City}%"));
        }
        
        if (filter.ReviewFilter != null)
        {
            if (filter.ReviewFilter.Rating.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Rating >= filter.ReviewFilter.Rating.Value));
            }

            if (filter.ReviewFilter.Stars.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Stars >= filter.ReviewFilter.Stars.Value));
            }
        }

        return await filteredRestaurants.ToListAsync();
    }
    
    public async Task<Restaurant?> GetRestaurantByIdAsync(int restaurantId)
    {

        return await _context.Restaurants
            .Include(r => r.Images)
            .Include(r => r.Reservations) 
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.Id == restaurantId);
    }

    
    public async Task<int> AddRestaurantAsync(Restaurant restaurant)
    {
        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();
        return restaurant.Id;
    }
    
    public async Task UpdateRestaurantAsync(Restaurant restaurant)
    {
        _context.Restaurants.Update(restaurant);
        await _context.SaveChangesAsync();
    }
    
    public async Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync()
    {
        return await _context.Restaurants
            .Include(r => r.Images) 
            .ToListAsync();
    }
    

}