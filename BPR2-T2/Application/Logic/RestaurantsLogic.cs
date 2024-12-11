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
        _storageAccount = Environment.GetEnvironmentVariable("AZURE_STORAGE_ACCOUNT");
        _accessKey = Environment.GetEnvironmentVariable("AZURE_STORAGE_ACCESS_KEY");

        if (string.IsNullOrEmpty(_storageAccount) || string.IsNullOrEmpty(_accessKey))
        {
            throw new Exception("Azure Storage account and/or access key are not set.");
        }

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
        var restaurant = await _restaurantsDao.GetRestaurantByIdAsync(restaurantId);
        return restaurant;
    }

    public async Task<Image> UploadImageAsync(IFormFile file, int restaurantId, string type)
    {
        var imageId = Guid.NewGuid();
        var blobName = $"{restaurantId}-{imageId}-{type}";
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
            ContentType = file.ContentType,
            Type = type
        };
    }


    public async Task<List<Image>> ListImagesAsyncByRestaurantId(int restaurantId)
    {
        var images = new List<Image>();

        await foreach (var blobItem in _imagesContainer.GetBlobsAsync())
        {
            // "restaurantId-imageId-type"
            var blobNameParts = blobItem.Name.Split('-', 2);

            if (blobNameParts.Length > 1 && int.TryParse(blobNameParts[0], out var imageRestaurantId) &&
                imageRestaurantId == restaurantId)
            {
                Guid imageId;
                var isValidGuid = Guid.TryParse(blobNameParts[1], out imageId);

                var blobClient = _imagesContainer.GetBlobClient(blobItem.Name);

                images.Add(new Image
                {
                    Id = imageId,
                    Uri = blobClient.Uri.ToString(),
                    Name = blobItem.Name,
                    ContentType = blobItem.Properties.ContentType,
                });
            }
        }

        return images;
    }

    public async Task<List<Image>> ListImagesAsyncByRestaurantIdAndType(int restaurantId, string type)
    {
        var images = new List<Image>();

        await foreach (var blobItem in _imagesContainer.GetBlobsAsync())
        {
            try
            {
                var lastHyphenIndex = blobItem.Name.LastIndexOf('-');

                var prefix = blobItem.Name.Substring(0, lastHyphenIndex);
                var suffix = blobItem.Name.Substring(lastHyphenIndex + 1);

                var parts = prefix.Split('-', 2);
                if (parts.Length != 2)
                {
                    continue;
                }

                if (!int.TryParse(parts[0], out var imageRestaurantId) || imageRestaurantId != restaurantId)
                {
                    continue;
                }

                if (!suffix.Equals(type, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                if (!Guid.TryParse(parts[1], out var imageId))
                {
                    continue;
                }

                var blobClient = _imagesContainer.GetBlobClient(blobItem.Name);
                images.Add(new Image
                {
                    Id = imageId,
                    Uri = blobClient.Uri.ToString(),
                    Name = blobItem.Name,
                    ContentType = blobItem.Properties.ContentType,
                    Type = type
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing blob: {blobItem.Name}, Exception: {ex.Message}");
            }
        }

        return images;
    }

    public async Task DeleteImageById(Guid imageId)
    {
        await foreach (var blobItem in _imagesContainer.GetBlobsAsync())
        {
            try
            {
                var lastHyphenIndex = blobItem.Name.LastIndexOf('-');
                if (lastHyphenIndex <= 0) 
                {
                    continue;
                }

                var prefix = blobItem.Name.Substring(0, lastHyphenIndex);
                var suffix = blobItem.Name.Substring(lastHyphenIndex + 1);

                var parts = prefix.Split('-', 2);
                if (parts.Length != 2)
                {
                    continue;
                }

                if (!Guid.TryParse(parts[1], out var parsedImageId) || parsedImageId != imageId)
                {
                    continue;
                }
                
                var blobClient = _imagesContainer.GetBlobClient(blobItem.Name);
                await blobClient.DeleteIfExistsAsync();

                Console.WriteLine($"Deleted blob: {blobItem.Name}");
                return;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing blob: {blobItem.Name}, Exception: {ex.Message}");
            }
        }
        
        throw new Exception($"Image with ID {imageId} not found.");
    }
}