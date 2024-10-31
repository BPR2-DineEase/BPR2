using Shared.Models;

namespace BPR2_T2.Services;

public interface IRestaurantFilterService
{
    Task<List<Restaurant>> RestaurantFilterByCuisine(string cuisine);
    Task<List<Restaurant>> SearchByCity(string city);
}