using Shared.Models;

namespace BPR2_T2.Services;

public interface IRestaurantFilterService
{
    Task<Restaurant?> FilterByName(string restaurantName);
    Task<List<Restaurant>> SearchByCity(string city);
}