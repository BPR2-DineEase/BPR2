using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.DaoInterfaces;

public interface IRestaurantsDao
{
    
    Task<IEnumerable<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<IEnumerable<Restaurant>> SearchByCity(string city);
    Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter);
    Task<Restaurant?> GetRestaurantByIdAsync(int restaurantId);
    Task<int> AddRestaurantAsync(Restaurant restaurant); 
    Task UpdateRestaurantAsync(Restaurant restaurant);   
    Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync(); 
}