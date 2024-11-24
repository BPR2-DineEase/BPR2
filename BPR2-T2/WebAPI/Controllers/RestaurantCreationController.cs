using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantCreationController : ControllerBase
{
    private readonly IRestaurantCreationLogic _restaurantCreationLogic;
    private readonly IRestaurantsLogic _restaurantsLogic;

    public RestaurantCreationController(IRestaurantCreationLogic restaurantCreationLogic, IRestaurantsLogic restaurantsLogic)
    {
        _restaurantCreationLogic = restaurantCreationLogic;
        _restaurantsLogic = restaurantsLogic;
    }

    [HttpPost]
    public async Task<ActionResult<Restaurant>> CreateRestaurant([FromBody] CreateRestaurantDto dto)
    {
        if (dto == null)
        {
            return BadRequest("Restaurant data is required.");
        }

        try
        {
            var createdRestaurant = await _restaurantCreationLogic.AddRestaurantAsync(dto);
            return CreatedAtAction(nameof(GetRestaurantById), new { id = createdRestaurant.Id }, createdRestaurant);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateRestaurant(int id, [FromBody] UpdateRestaurantDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest("Restaurant ID mismatch.");
        }

        try
        {
            await _restaurantCreationLogic.UpdateRestaurantAsync(dto);
            return NoContent();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Restaurant>> GetRestaurantById(int id)
    {
        try
        {
            var restaurant = await _restaurantCreationLogic.GetRestaurantByIdAsync(id);

            if (restaurant == null)
            {
                return NotFound($"Restaurant with ID {id} not found.");
            }

            return Ok(restaurant);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Restaurant>>> GetAllRestaurants()
    {
        try
        {
            var restaurants = await _restaurantCreationLogic.GetAllRestaurantsAsync();
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
