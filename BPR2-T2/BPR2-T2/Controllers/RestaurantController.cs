using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BPR2_T2.Services;
using Microsoft.AspNetCore.Http;
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
    
    [HttpPost("upload")]
    public async Task<ActionResult<Image>> UploadImage(IFormFile file, int restaurantId)
    {
        if (file == null)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            var image = await restaurantFilterService.UploadImageAsync(file, restaurantId);

            var restaurant = restaurantFilterService.GetRestaurantById(restaurantId);
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
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }



    
    [HttpGet("list")]
    public async Task<ActionResult> ListAllImagesByRestaurantId(int restaurantId)
    {
        Console.WriteLine($"Fetching images for restaurantId: {restaurantId}");

        var images = await restaurantFilterService.ListImagesAsyncByRestaurantId(restaurantId);
    
        if (!images.Any())
        {
            return Ok(new { Message = "No images found for this restaurant." });
        }
    
        var imageUrls = images.Select(img => img.Uri).ToList();
        return Ok(imageUrls);
    }


    
    


}