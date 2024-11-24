using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.LogicInterfaces;

public interface IRestaurantCreationLogic
{
    
    Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto, List<IFormFile> images);
    Task UpdateRestaurantAsync(UpdateRestaurantDto updateRestaurantDto);
    Task<Restaurant?> GetRestaurantByIdAsync(int id);
    Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync();
    
    
}