using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.DaoInterfaces;

public interface IRestaurantsDao
{
    Task<IEnumerable<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<IEnumerable<Restaurant>> SearchByCity(string city);
    Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter);
    Task<Restaurant?> GetRestaurantById(int restaurantId);
    
}