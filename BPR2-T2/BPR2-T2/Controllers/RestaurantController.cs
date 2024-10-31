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

    // Make name a query parameter
    [HttpGet("filter")]
    public async Task<ActionResult> FilterByRestaurantName([FromQuery] RestaurantFilterByName restaurant)
    {
        try
        {
            var filteredRestaurant = await restaurantFilterService.FilterByName(restaurant.Name);
            return Ok(filteredRestaurant);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult> SearchByRestaurantLocation([FromQuery] RestaurantSearchByCity restaurant)
    {
        try
        {
            var filteredRestaurant = await restaurantFilterService.SearchByCity(restaurant.City);
            return Ok(filteredRestaurant);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}