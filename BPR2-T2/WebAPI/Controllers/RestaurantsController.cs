using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantsLogic _restaurantsLogic;

    public RestaurantsController(IRestaurantsLogic restaurantsLogic)
    {
        _restaurantsLogic = restaurantsLogic;
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchByRestaurantLocation([FromQuery] RestaurantSearchByCityDto dto)
    {
        try
        {
            var searchedRestaurants = await _restaurantsLogic.SearchByCity(dto.City);
            return Ok(searchedRestaurants);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("filter")]
    public async Task<ActionResult> FilterRestaurants(
        [FromQuery] string? name,
        [FromQuery] string? cuisine,
        [FromQuery] string? city,
        [FromQuery] double? rating,
        [FromQuery] int? stars)
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
            
            var restaurants = await _restaurantsLogic.FilterRestaurants(filter);
            return Ok(restaurants);
            
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }
}