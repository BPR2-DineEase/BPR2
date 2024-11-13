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
        var cuisines = _context.Restaurants.Where(x => x.Cuisine.Equals(cuisine));
        await _context.SaveChangesAsync();
        return await Task.FromResult(cuisines);
    }

    public async Task<IEnumerable<Restaurant>> SearchByCity(string city)
    {
        var cities =  _context.Restaurants.Where(x => x.City.Equals(city));
        await _context.SaveChangesAsync();
        return await Task.FromResult(cities);
    }

    public async Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter)
    {
        var filteredRestaurants = _context.Restaurants.AsQueryable();
    
        if (!string.IsNullOrWhiteSpace(filter.Name))
            filteredRestaurants = filteredRestaurants.Where(r => EF.Functions.Like(r.Name, $"%{filter.Name}%"));

        if (!string.IsNullOrWhiteSpace(filter.Cuisine))
            filteredRestaurants = filteredRestaurants.Where(r => EF.Functions.Like(r.Cuisine, filter.Cuisine));

        if (!string.IsNullOrWhiteSpace(filter.City))
            filteredRestaurants = filteredRestaurants.Where(r => EF.Functions.Like(r.City, filter.City));

        if (filter.ReviewFilter != null)
        {
            if (filter.ReviewFilter.Rating.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Rating >= filter.ReviewFilter.Rating));
            }

            if (filter.ReviewFilter.Stars.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Stars >= filter.ReviewFilter.Stars));
            }
        }

        return await filteredRestaurants.ToListAsync();
    }


    public async Task<Restaurant?> GetRestaurantById(int restaurantId)
    {
        var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restaurantId);
        await _context.SaveChangesAsync();
        return await Task.FromResult(restaurant);
    }
}