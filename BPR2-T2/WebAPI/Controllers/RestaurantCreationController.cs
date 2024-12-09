using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Dtos.ReservationDtos;
using Domain.Dtos.RestaurantDtos;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantCreationController : ControllerBase
{
    private readonly IRestaurantCreationLogic _restaurantCreationLogic;
    private readonly IRestaurantsLogic _restaurantsLogic;
    private readonly IReservationsLogic _reservationLogic;

    public RestaurantCreationController(IRestaurantCreationLogic restaurantCreationLogic,
        IRestaurantsLogic restaurantsLogic, IReservationsLogic _reservationLogic)
    {
        _restaurantCreationLogic = restaurantCreationLogic;
        _restaurantsLogic = restaurantsLogic;
        this._reservationLogic = _reservationLogic;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRestaurant([FromForm] CreateRestaurantDto dto,
        [FromForm] List<IFormFile> files)
    {
        if (dto == null)
        {
            return BadRequest("Restaurant data is required.");
        }

        if (files == null || !files.Any())
        {
            return BadRequest("At least one image file must be uploaded.");
        }

        try
        {
            var createdRestaurant = await _restaurantCreationLogic.AddRestaurantAsync(dto, files);
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
    public async Task<ActionResult<RestaurantPreviewDto>> GetRestaurantById(int id)
    {
        try
        {
            var restaurant = await _restaurantCreationLogic.GetRestaurantByIdAsync(id);

            if (restaurant == null)
            {
                return NotFound("Restaurant not found.");
            }

            var reservations = await _reservationLogic.GetReservationsByRestaurantIdAsync(restaurant.Id);
            var images = await _restaurantsLogic.ListImagesAsyncByRestaurantId(id);
            var restaurantProfile = new RestaurantPreviewDto()
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                City = restaurant.City,
                Cuisine = restaurant.Cuisine,
                Address = restaurant.Address,
                Review = restaurant.Review,
                OpenHours = restaurant.OpenHours,
                Images =
                    images.Select(img => new ImageDto { Uri = img.Uri, Name = img.Name, Type = img.Type }).ToList(),
                Reservations = reservations.Select(reservation => new Reservation
                {
                    Id = reservation.Id, GuestName = reservation.GuestName, Comments = reservation.Comments,
                    PhoneNumber = reservation.PhoneNumber, Date = reservation.Date, RestaurantId = restaurant.Id,
                    Time = reservation.Time, Email = reservation.Email, NumOfPeople = reservation.NumOfPeople
                }).ToList()
            };

            return Ok(restaurantProfile);
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
    public async Task<ActionResult<Image>> UploadImage(IFormFile file, int restaurantId, string type)
    {
        if (file == null)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            var image = await _restaurantsLogic.UploadImageAsync(file, restaurantId, type);

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

    [HttpGet("{restaurantId}/images/{type}")]
    public async Task<ActionResult> ListAllImagesByRestaurantIdAndType(int restaurantId, string type)
    {
        try
        {
            var images = await _restaurantsLogic.ListImagesAsyncByRestaurantIdAndType(restaurantId, type);

            if (!images.Any())
            {
                Console.WriteLine($"No images found for restaurantId: {restaurantId} and type: {type}");
                return NotFound($"No images of type '{type}' found for restaurant with ID {restaurantId}.");
            }

            var imagesUrl = images.Select(img => img.Uri).ToList();
            Console.WriteLine($"Found {imagesUrl.Count} images for restaurantId: {restaurantId} and type: {type}");
            return Ok(imagesUrl);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error occurred: {e.Message}");
            return StatusCode(500, e.Message);
        }
    }

    [HttpDelete("{imageId:guid}/images")]
    public async Task<IActionResult> DeleteImageById(Guid imageId)
    {
        try
        {
            await _restaurantCreationLogic.DeleteImageById(imageId);
            return NoContent(); // Return 204 No Content for successful deletion
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }
}