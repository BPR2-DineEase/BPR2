using BPR2_T2.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Models;

namespace BPR2_T2.Controllers;

[ApiController]
[Route("[controller]")]
public class RestaurantController : ControllerBase
{
    private readonly IRestaurantFilterService restaurantFilterService;

    public RestaurantController(IRestaurantFilterService restaurantFilterService)
    {
        this.restaurantFilterService = restaurantFilterService;
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchByRestaurantLocation([FromQuery] RestaurantSearchByCityDto restaurant)
    {
        try
        {
            var searchedRestaurant = await restaurantFilterService.SearchByCity(restaurant.City);
            return Ok(searchedRestaurant);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("filter")]
    public async Task<ActionResult> FilterRestaurants(
        [FromQuery] string? name,
        [FromQuery] string? cuisine,
        [FromQuery] string? city,
        [FromQuery] double rating,
        [FromQuery] int stars)
    {
        try
        {
            var filter = new RestaurantFilterDto
            {
                Name = name,
                Cuisine = cuisine,
                City = city,
                ReviewFilter = new ReviewFilterDto
                {
                    Rating = rating,
                    Stars = stars
                }
            };

            List<Restaurant> filteredRestaurants = await restaurantFilterService.FilterRestaurants(filter);
            return Ok(filteredRestaurants);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}