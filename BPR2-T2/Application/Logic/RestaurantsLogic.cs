using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Logic;

public class RestaurantsLogic : IRestaurantsLogic
{
    private IRestaurantsDao _restaurantsDao;
    private readonly string? _storageAccount;
    private readonly string? _accessKey;
    private readonly BlobContainerClient _imagesContainer;

    public RestaurantsLogic(IRestaurantsDao restaurantsDao, IConfiguration configuration)
    {
        _storageAccount = configuration["AzureStorage:StorageAccount"];
        _accessKey = configuration["AzureStorage:AccessKey"];

        var credential = new StorageSharedKeyCredential(_storageAccount, _accessKey);
        var blobUri = $"https://{_storageAccount}.blob.core.windows.net";
        var blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
        _imagesContainer = blobServiceClient.GetBlobContainerClient("bpr2imagecontainer");

        _restaurantsDao = restaurantsDao;
    }

    public async Task<IEnumerable<Restaurant>> RestaurantFilterByCuisine(string cuisine)
    {
        var cuisines = await _restaurantsDao.RestaurantFilterByCuisine(cuisine);

        return await Task.FromResult(cuisines);
    }

    public async Task<IEnumerable<Restaurant>> SearchByCity(string city)
    {
        var cities = await _restaurantsDao.SearchByCity(city);

        return await Task.FromResult(cities);
    }

    public async Task<IEnumerable<Restaurant>> FilterRestaurants(RestaurantFilterDto filter)
    {
        var filterRestaurants = await _restaurantsDao.FilterRestaurants(filter);

        return await Task.FromResult(filterRestaurants);
    }

    public async Task<Restaurant?> GetRestaurantById(int restaurantId)
    {
        var filteredRestaurants = await _restaurantsDao.GetRestaurantById(restaurantId);

        return await Task.FromResult(filteredRestaurants);
    }

    public async Task<Image> UploadImageAsync(IFormFile file, int restaurantId)
    {
        var imageId = Guid.NewGuid();
        var blobName = $"{restaurantId}-{imageId}-{file.FileName}";
        var blobClient = _imagesContainer.GetBlobClient(blobName);

        var blobHttpHeaders = new BlobHttpHeaders
        {
            ContentType = file.ContentType
        };

        await using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, new BlobUploadOptions
        {
            HttpHeaders = blobHttpHeaders
        });

        return new Image
        {
            Id = imageId,
            Uri = blobClient.Uri.ToString(),
            Name = file.FileName,
            ContentType = file.ContentType
        };
    }

    public async Task<List<Image>> ListImagesAsyncByRestaurantId(int restaurantId)
    {
        var images = new List<Image>();

        await foreach (var blobItem in _imagesContainer.GetBlobsAsync())
        {
            // "restaurantId-imageId-fileName"
            var blobNameParts = blobItem.Name.Split('-', 2);

            if (blobNameParts.Length > 1 && int.TryParse(blobNameParts[0], out var imageRestaurantId) &&
                imageRestaurantId == restaurantId)
            {
                Guid imageId;
                bool isValidGuid = Guid.TryParse(blobNameParts[1], out imageId);

                var blobClient = _imagesContainer.GetBlobClient(blobItem.Name);

                images.Add(new Image
                {
                    Id = imageId,
                    Uri = blobClient.Uri.ToString(),
                    Name = blobItem.Name,
                    ContentType = blobItem.Properties.ContentType
                });
            }
        }

        return images;
    }
}