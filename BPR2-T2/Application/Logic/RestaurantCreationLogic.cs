using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Application.Services;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Logic;

public class RestaurantCreationLogic : IRestaurantCreationLogic
{
    private readonly IRestaurantsDao _restaurantsDao;
    private readonly IImageDao _imageDao;
    private readonly IRestaurantsLogic _restaurantsLogic;
    private readonly IGoogleMapsService _googleMapsService;

    public RestaurantCreationLogic(IRestaurantsDao restaurantsDao, IImageDao imageDao, IRestaurantsLogic restaurantsLogic, IGoogleMapsService googleMapsService)
    {
        _restaurantsDao = restaurantsDao;
        _imageDao = imageDao;
        _restaurantsLogic = restaurantsLogic;
        _googleMapsService = googleMapsService;
    }

    public async Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto, List<IFormFile>? images)
    {
        
        if (!createRestaurantDto.Latitude.HasValue || !createRestaurantDto.Longitude.HasValue)
        {
            try
            {
                var coordinates = await _googleMapsService.GetCoordinatesAsync(createRestaurantDto.Address, createRestaurantDto.City);
                createRestaurantDto.Latitude = coordinates.Latitude;
                createRestaurantDto.Longitude = coordinates.Longitude;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve coordinates from Google Maps.", ex);
            }
        }

        
        var restaurant = new Restaurant
        {
            Name = createRestaurantDto.Name,
            Address = createRestaurantDto.Address,
            City = createRestaurantDto.City,
            OpenHours = createRestaurantDto.OpenHours,
            Cuisine = createRestaurantDto.Cuisine,
            Info = createRestaurantDto.Info,
            Latitude = createRestaurantDto.Latitude.Value, 
            Longitude = createRestaurantDto.Longitude.Value,
        };
        
        var restaurantId = await _restaurantsDao.AddRestaurantAsync(restaurant);
        
        if (images != null && images.Any())
        {
            await HandleImagesAsync(images, restaurantId);
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

    private async Task HandleImagesAsync(List<IFormFile> images, int restaurantId)
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

        if (uploadedImages.Any())
        {
            await _imageDao.AddImagesAsync(uploadedImages);
        }
    }
}