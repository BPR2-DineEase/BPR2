using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.LogicInterfaces;

public interface IRestaurantsLogic
{
    Task<IEnumerable<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<IEnumerable<Restaurant>> SearchByCity(string city);
    Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter);
    Task<Restaurant?> GetRestaurantById(int restaurantId);

    Task<Image> UploadImageAsync(IFormFile file, int restaurantId, string type);

    Task<List<Image>> ListImagesAsyncByRestaurantId(int restaurantId);
    Task<List<Image>> ListImagesAsyncByRestaurantIdAndType(int restaurantId, string type);
    
    Task DeleteImageById(Guid ImageId);


    
}