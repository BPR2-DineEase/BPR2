using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Shared.Dtos;
using Shared.Models;

namespace BPR2_T2.Services;

public interface IRestaurantFilterService
{
    Task<List<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<List<Restaurant>> SearchByCity(string city);
    Task<List<Restaurant>> FilterRestaurants(RestaurantFilterDto filter);
    Restaurant? GetRestaurantById(int restaurantId);

    Task<Image> UploadImageAsync(IFormFile file, int restaurantId);

    Task<List<Image>> ListImagesAsyncByRestaurantId(int restaurantId);
}