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
            Address = "test2",
            OpenHours = "10-16",
            Cousine = "vegan",
            Reviews = new List<Review>
            {
                new Review
                {
                    Id = 1,
                    Rating = 8.5,
                    Comment = "test3",
                    Date = DateTime.Now,
                    Stars = 5
                }
            },
        },
    };
    
    public Task<Restaurant?> FilterByName(string RestaurantName)
    {
        Restaurant? restaurant = restaurants.FirstOrDefault(r => r.Name == RestaurantName);
        
        
        return Task.FromResult(restaurant);
    }
}