using Domain.Dtos;
using Domain.Models;

namespace Application.LogicInterfaces;

public interface IRestaurantCreationLogic
{
    
    Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto);
    Task UpdateRestaurantAsync(UpdateRestaurantDto updateRestaurantDto);
    Task<Restaurant?> GetRestaurantByIdAsync(int id);
    Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync();
    
    
}