using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Application.Services;
using Domain.Dtos;
using Domain.Dtos.RestaurantDtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Logic;

public class RestaurantCreationLogic : IRestaurantCreationLogic
{
    private readonly IRestaurantsDao _restaurantsDao;
    private readonly IImageDao _imageDao;
    private readonly IRestaurantsLogic _restaurantsLogic;
    private readonly IGoogleMapsService _googleMapsService;

    public RestaurantCreationLogic(IRestaurantsDao restaurantsDao, IImageDao imageDao,
        IRestaurantsLogic restaurantsLogic, IGoogleMapsService googleMapsService)
    {
        _restaurantsDao = restaurantsDao;
        _imageDao = imageDao;
        _restaurantsLogic = restaurantsLogic;
        _googleMapsService = googleMapsService;
    }

    public async Task<Restaurant> AddRestaurantAsync(CreateRestaurantDto createRestaurantDto, List<IFormFile>? images)
    {
        var coordinates =
            await _googleMapsService.GetCoordinatesAsync(createRestaurantDto.Address, createRestaurantDto.City);

        var restaurant = new Restaurant
        {
            Name = createRestaurantDto.Name,
            Address = createRestaurantDto.Address,
            City = createRestaurantDto.City,
            OpenHours = createRestaurantDto.OpenHours,
            Cuisine = createRestaurantDto.Cuisine,
            Capacity = createRestaurantDto.Capacity,
            Info = createRestaurantDto.Info,
            Latitude = coordinates.Latitude,
            Longitude = coordinates.Longitude,
        };

        var restaurantId = await _restaurantsDao.AddRestaurantAsync(restaurant);

        if (images != null && images.Any())
        {
            await HandleImagesAsync(images, restaurantId, createRestaurantDto.ImageTypes);
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
        restaurant.Capacity = updateRestaurantDto.Capacity;
        restaurant.OpenHours = updateRestaurantDto.OpenHours;
        restaurant.Cuisine = updateRestaurantDto.Cuisine;
        restaurant.Info = updateRestaurantDto.Info;

        await _restaurantsDao.UpdateRestaurantAsync(restaurant);

        if (updateRestaurantDto.ImageUris != null && updateRestaurantDto.ImageUris.Any())
        {
            var images = updateRestaurantDto.ImageUris.Select((uri, index) => new Image
            {
                Uri = uri,

               // Type = updateRestaurantDto.ImageTypes.ElementAtOrDefault(index) ?? "default",
                //RestaurantId = restaurant.Id

                Type = "restaurant",
                RestaurantId = updateRestaurantDto.Id

            }).ToList();

            await _imageDao.AddImagesAsync(images);
        }
    }

    public async Task<RestaurantPreviewDto?> GetRestaurantByIdAsync(int restaurantId)
    {
        var restaurant = await _restaurantsDao.GetRestaurantByIdAsync(restaurantId);

        if (restaurant == null)
        {
            return null;
        }
        
        return new RestaurantPreviewDto
        {
            Id = restaurant.Id,
            Name = restaurant.Name,
            Address = restaurant.Address,
            City = restaurant.City,
            OpenHours = restaurant.OpenHours,
            Cuisine = restaurant.Cuisine,
            Info = restaurant.Info,
            Capacity = restaurant.Capacity,
            Images = restaurant.Images?.Select(img => new ImageDto
            {
                Id = img.Id,
                Uri = img.Uri,
                Type = img.Type
            }).ToList()
        };
    }

    public async Task<IEnumerable<Restaurant>> GetAllRestaurantsAsync()
    {
        return await _restaurantsDao.GetAllRestaurantsAsync();
    }

    private async Task HandleImagesAsync(List<IFormFile> images, int restaurantId, List<string>? imageTypes)
    {
        var uploadedImages = new List<Image>();
        
        var restaurant = await _restaurantsDao.GetRestaurantByIdAsync(restaurantId);

        for (int i = 0; i < images.Count; i++)
        {
            var formFile = images[i];
            if (formFile.Length > 0)
            {
                var type = imageTypes != null && imageTypes.Count > i ? imageTypes[i] : "default";
                var uploadedImage = await _restaurantsLogic.UploadImageAsync(formFile, restaurantId);
                uploadedImage.RestaurantId = restaurantId;
                uploadedImage.Type = type;
                uploadedImages.Add(uploadedImage);
            }
        }

        if (uploadedImages.Any())
        {
            await _imageDao.AddImagesAsync(uploadedImages);
        }
    }
}