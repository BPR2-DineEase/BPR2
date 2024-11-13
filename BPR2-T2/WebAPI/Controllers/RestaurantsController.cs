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
    
    
    [HttpPost("uploadImage")]
    public async Task<ActionResult<Image>> UploadImage(IFormFile file, int restaurantId)
    {
        if (file == null)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            var image = await _restaurantsLogic.UploadImageAsync(file, restaurantId);

            var restaurant = await _restaurantsLogic.GetRestaurantById(restaurantId);
            
            if (restaurant == null)
            {
                return NotFound($"Restaurant with ID {restaurantId} not found.");
            }

            if (restaurant.Images == null)
            {
                restaurant.Images = new List<Image>();
            }

            restaurant.Images.Add(image);
            
            return Ok(image);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("{restaurantId}/images")]
    public async Task<ActionResult> ListAllImagesByRestaurantId(int restaurantId)
    {
        try
        {
            var images = await _restaurantsLogic.ListImagesAsyncByRestaurantId(restaurantId);

            if (!images.Any())
            {
                return NotFound($"Images for restaurant with ID {restaurantId} not found.");
            }

            var imagesUrl = images.Select(img => img.Uri).ToList();
            return Ok(imagesUrl);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }
    
    
}