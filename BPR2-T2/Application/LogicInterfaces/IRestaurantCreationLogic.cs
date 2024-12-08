using Domain.Dtos;
using Domain.Dtos.RestaurantDtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.LogicInterfaces;

public interface IRestaurantCreationLogic
{
    
    Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto, List<IFormFile> images);
    Task UpdateRestaurantAsync(UpdateRestaurantDto updateRestaurantDto);
    Task<RestaurantPreviewDto?> GetRestaurantByIdAsync(int restaurantId);
    Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync();
    
    
}