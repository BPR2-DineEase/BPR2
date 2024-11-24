using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Logic;

public class RestaurantCreationLogic : IRestaurantCreationLogic
{
    private readonly IRestaurantsDao _restaurantsDao;
    private readonly IImageDao _imageDao;
    private readonly IRestaurantsLogic _restaurantsLogic;

    public RestaurantCreationLogic(IRestaurantsDao restaurantsDao, IImageDao imageDao, IRestaurantsLogic restaurantsLogic)
    {
        _restaurantsDao = restaurantsDao;
        _imageDao = imageDao;
        _restaurantsLogic = restaurantsLogic;
    }

    public async Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto, List<IFormFile>? images)
    {
        var restaurant = new Restaurant
        {
            Name = createRestaurantDto.Name,
            Address = createRestaurantDto.Address,
            City = createRestaurantDto.City,
            OpenHours = createRestaurantDto.OpenHours,
            Cuisine = createRestaurantDto.Cuisine,
            Info = createRestaurantDto.Info,
        };
        
        var restaurantId = await _restaurantsDao.AddRestaurantAsync(restaurant);

        if (images != null && images.Any())
        {
            var uploadedImages = new List<Image>();

            foreach (var formFile in images)
            {
                if (formFile.Length > 0)
                {
                    var uploadedImage = await _restaurantsLogic.UploadImageAsync(formFile, restaurantId);
                    uploadedImage.RestaurantId = restaurantId;
                    uploadedImages.Add(uploadedImage);
                }
            }
            
            await _imageDao.AddImagesAsync(uploadedImages);
        }

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
            var images = updateRestaurantDto.ImageUris.Select(uri => new Image
            {
                Uri = uri,
                RestaurantId = restaurant.Id 
            }).ToList();

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