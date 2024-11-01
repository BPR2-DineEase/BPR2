using Shared.Dtos;
using Shared.Models;

namespace BPR2_T2.Services;

public class RestaurantFilterService : IRestaurantFilterService
{
    private readonly IList<Restaurant> restaurants = new List<Restaurant>()
    {
        new Restaurant
        {
            Id = 1,
            Name = "test1",
            Address = "123 main street",
            OpenHours = "10-16",
            Cuisine = "French",
            City = "Horsens",
            Reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    Rating = 7.5,
                    Comment = "test3",
                    Date = DateTime.Now,
                    Stars = 5
                }
            },
        },
        new Restaurant
        {
            Id = 2,
            Name = "test1",
            Address = "123 main street",
            OpenHours = "10-16",
            Cuisine = "Italian",
            City = "Horsens",
            Reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    Rating = 8.5,
                    Comment = "test3",
                    Date = DateTime.Now,
                    Stars = 4
                }
            },
        }
    };

    public Task<List<Restaurant>> RestaurantFilterByCuisine(string cuisine)
    {
        var cuisines = restaurants.Where(r => r.Cuisine == cuisine).ToList();


        return Task.FromResult(cuisines);
    }

    public Task<List<Restaurant>> SearchByCity(string city)
    {
        var restaurantsInCity = restaurants.Where(r => r.City == city).ToList();
        return Task.FromResult(restaurantsInCity);
    }

    public Task<List<Restaurant>> FilterRestaurants(RestaurantFilterDto filter)
    {
        var filteredRestaurants = restaurants.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Name))
            filteredRestaurants = filteredRestaurants.Where(r => r.Name.Contains(filter.Name));

        if (!string.IsNullOrWhiteSpace(filter.Cuisine))
            filteredRestaurants = filteredRestaurants.Where(r => r.Cuisine.Equals(filter.Cuisine, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(filter.City))
            filteredRestaurants = filteredRestaurants.Where(r => r.City.Equals(filter.City, StringComparison.OrdinalIgnoreCase));

        if (filter.ReviewFilter != null)
        {
            if (filter.ReviewFilter.Rating.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Rating >= filter.ReviewFilter.Rating));
            }

            if (filter.ReviewFilter.Stars.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Stars >= filter.ReviewFilter.Stars));
            }
        }

        return Task.FromResult(filteredRestaurants.ToList());
    }

}