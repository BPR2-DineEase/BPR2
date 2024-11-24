using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Models;

namespace Application.Logic;

public class RestaurantCreationLogic : IRestaurantCreationLogic
{
    private readonly IRestaurantsDao _restaurantsDao;
    private readonly IImageDao _imageDao;

    public RestaurantCreationLogic(IRestaurantsDao restaurantsDao, IImageDao imageDao)
    {
        _restaurantsDao = restaurantsDao;
        _imageDao = imageDao;
    }

    public async Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto)
    {
        // Create the restaurant entity
        var restaurant = new Restaurant
        {
            Name = createRestaurantDto.Name,
            Address = createRestaurantDto.Address,
            City = createRestaurantDto.City,
            OpenHours = createRestaurantDto.OpenHours,
            Cuisine = createRestaurantDto.Cuisine,
            Info = createRestaurantDto.Info,
        };

        // Save the restaurant to the database
        var restaurantId = await _restaurantsDao.AddRestaurantAsync(restaurant);

        // Process and save associated images
        if (createRestaurantDto.ImageUris != null && createRestaurantDto.ImageUris.Any())
        {
            var images = createRestaurantDto.ImageUris.Select(uri => new Image
            {
                Uri = uri,
                Name = Path.GetFileName(uri) ?? "DefaultImageName", // Extract name from Uri or set a default name
                ContentType = "image/jpeg" // Default content type, or infer dynamically
            }).ToList();

            await _imageDao.AddImagesAsync(images);
        }

        // Return the created restaurant with details
        return await _restaurantsDao.GetRestaurantByIdAsync(restaurantId);
    }

    public async Task UpdateRestaurantAsync(UpdateRestaurantDto updateRestaurantDto)
    {
        var restaurant = await _restaurantsDao.GetRestaurantByIdAsync(updateRestaurantDto.Id);
        if (restaurant == null)
        {
            throw new Exception("Restaurant not found.");
        }

        restaurant.Name = updateRestaurantDto.Name;
        restaurant.Address = updateRestaurantDto.Address;
        restaurant.City = updateRestaurantDto.City;
        restaurant.OpenHours = updateRestaurantDto.OpenHours;
        restaurant.Cuisine = updateRestaurantDto.Cuisine;
        restaurant.Info = updateRestaurantDto.Info;

        await _restaurantsDao.UpdateRestaurantAsync(restaurant);

        if (updateRestaurantDto.ImageUris != null && updateRestaurantDto.ImageUris.Any())
        {
            var images = updateRestaurantDto.ImageUris.Select(uri => new Image { Uri = uri }).ToList();
            await _imageDao.AddImagesAsync(images);
        }
    }

    public async Task<Restaurant?> GetRestaurantByIdAsync(int id)
    {
        return await _restaurantsDao.GetRestaurantByIdAsync(id);
    }

    public async Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync()
    {
        return await _restaurantsDao.GetAllRestaurantsAsync();
    }
}
