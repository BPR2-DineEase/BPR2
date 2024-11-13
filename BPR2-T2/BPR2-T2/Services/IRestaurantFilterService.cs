using Domain.Dtos;
using Domain.Models;

namespace BPR2_T2.Services;

public interface IRestaurantFilterService
{
    Task<List<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<List<Restaurant>> SearchByCity(string city);
    Task<List<Restaurant>> FilterRestaurants(RestaurantFilterDto filter);
    Task<Restaurant>? GetRestaurantById(int restaurantId);

    Task<Image> UploadImageAsync(IFormFile file, int restaurantId);

    Task<List<Image>> ListImagesAsyncByRestaurantId(int restaurantId);
}