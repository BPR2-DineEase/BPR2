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

        Console.WriteLine($"Started listing images for restaurantId: {restaurantId} and type: {type}");

        // Log the initial state of the images list (it will be empty initially)
        Console.WriteLine($"Initial images list count: {images.Count}");

        await foreach (var blobItem in _imagesContainer.GetBlobsAsync())
        {
            Console.WriteLine($"Processing blob: {blobItem.Name}");

            // "restaurantId-imageId-type"
            var blobNameParts = blobItem.Name.Split('-', 3);

            if (blobNameParts.Length > 1 &&
                int.TryParse(blobNameParts[0], out var imageRestaurantId) &&
                imageRestaurantId == restaurantId)
            {
                Console.WriteLine($"Blob matches restaurantId: {imageRestaurantId}");

                Guid imageId;
                var isValidGuid = Guid.TryParse(blobNameParts[1], out imageId);

                if (isValidGuid)
                {
                    Console.WriteLine($"Blob has a valid Guid: {imageId}");
                }
                else
                {
                    Console.WriteLine($"Blob has an invalid Guid: {blobNameParts[1]}");
                    continue; // Skip processing this blob if the Guid is invalid
                }

                var equals = blobNameParts[2].Equals(type, StringComparison.OrdinalIgnoreCase);
                Console.WriteLine($"Blob type matches: {equals}");

                if (isValidGuid && equals)
                {
                    var blobClient = _imagesContainer.GetBlobClient(blobItem.Name);
                    var image = new Image
                    {
                        Id = imageId,
                        Uri = blobClient.Uri.ToString(),
                        Name = blobItem.Name,
                        ContentType = blobItem.Properties.ContentType,
                        Type = type
                    };

                    images.Add(image);
                    Console.WriteLine($"Added image: {image.Name}");
                }
            }
            else
            {
                Console.WriteLine($"Blob does not match restaurantId or type.");
            }
        }

        Console.WriteLine($"Final images list count: {images.Count}");

        foreach (var image in images)
        {
            Console.WriteLine($"Image: {image.Name}, Type: {image.Type}, Uri: {image.Uri}");
        }

        return images;

    }
}