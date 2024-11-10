using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Shared.Dtos;
using Shared.Models;

namespace BPR2_T2.Services;

public class RestaurantFilterService : IRestaurantFilterService
{
    private readonly string? _storageAccount;
    private readonly string? _accessKey;
    private readonly BlobContainerClient _imagesContainer;

    public RestaurantFilterService()
    {
        // _storageAccount = Environment.GetEnvironmentVariable("AZURE_STORAGE_ACCOUNT");
        // _accessKey = Environment.GetEnvironmentVariable("AZURE_STORAGE_ACCESS_KEY");

        _storageAccount = "";
        _accessKey = "";

        var credential = new StorageSharedKeyCredential(_storageAccount, _accessKey);
        var blobUri = $"https://{_storageAccount}.blob.core.windows.net";
        var blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
        _imagesContainer = blobServiceClient.GetBlobContainerClient("bpr2imagecontainer");
    }

    private readonly IList<Restaurant> restaurants = new List<Restaurant>
    {
        new Restaurant
        {
            Id = 1,
            Name = "test1",
            Address = "123 main street",
            OpenHours = "10-16",
            Cuisine = "French",
            City = "Horsens",
            Images = new List<Image>
            {
                new Image
                {
                    Uri =
                        "https://bpr2imagestorage.blob.core.windows.net/bpr2imagecontainer/1-235457a0-7f97-4b9c-b2d1-86cfc07933ce-Restaturant.jpg",
                    Name = "Restaurant.jpg",
                    ContentType = "image/jpeg"
                }
            },
            Reviews = new List<Review>
            {
                new Review { Id = 1, Rating = 7.5, Comment = "test3", Date = DateTime.Now, Stars = 5 }
            }
        },
        new Restaurant
        {
            Id = 2,
            Name = "test2",
            Address = "123 main street",
            OpenHours = "10-16",
            Cuisine = "Italian",
            City = "Horsens",
            Images = new List<Image>
            {
                new Image
                {
                    Uri =
                        "https://bpr2imagestorage.blob.core.windows.net/bpr2imagecontainer/1-235457a0-7f97-4b9c-b2d1-86cfc07933ce-Restaturant.jpg",
                    Name = "Pizza Image",
                    ContentType = "image/jpeg"
                }
            },
            Reviews = new List<Review>
            {
                new Review { Id = 1, Rating = 8.5, Comment = "test3", Date = DateTime.Now, Stars = 4 }
            }
        },
        new Restaurant
        {
            Id = 3,
            Name = "Pizza World",
            Address = "123 main street",
            OpenHours = "10-16",
            Cuisine = "Italian",
            City = "Aarhus",
            Images = new List<Image>
            {
                new Image
                {
                    Uri =
                        "https://bpr2imagestorage.blob.core.windows.net/bpr2imagecontainer/1-235457a0-7f97-4b9c-b2d1-86cfc07933ce-Restaturant.jpg",
                    Name = "Pizza World Image",
                    ContentType = "image/jpeg"
                }
            },
            Reviews = new List<Review>
            {
                new Review { Id = 1, Rating = 8.5, Comment = "test3", Date = DateTime.Now, Stars = 4 }
            }
        }
    };


    public Task<List<Restaurant>> RestaurantFilterByCuisine(string cuisine)
    {
        var cuisines = restaurants.Where(r => r.Cuisine == cuisine).ToList();


        return Task.FromResult(cuisines);
    }

    public Task<List<Restaurant>> SearchByCity(string city)
    {
        var restaurantsInCity = restaurants.Where(r => r.City == city).ToList();
        return Task.FromResult(restaurantsInCity);
    }

    public Task<List<Restaurant>> FilterRestaurants(RestaurantFilterDto filter)
    {
        var filteredRestaurants = restaurants.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Name))
            filteredRestaurants = filteredRestaurants.Where(r => r.Name.Contains(filter.Name));

        if (!string.IsNullOrWhiteSpace(filter.Cuisine))
            filteredRestaurants =
                filteredRestaurants.Where(r => r.Cuisine.Equals(filter.Cuisine, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrWhiteSpace(filter.City))
            filteredRestaurants =
                filteredRestaurants.Where(r => r.City.Equals(filter.City, StringComparison.OrdinalIgnoreCase));

        if (filter.ReviewFilter != null)
        {
            if (filter.ReviewFilter.Rating.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Rating >= filter.ReviewFilter.Rating));
            }

            if (filter.ReviewFilter.Stars.HasValue)
            {
                filteredRestaurants = filteredRestaurants
                    .Where(r => r.Reviews.Any(review => review.Stars >= filter.ReviewFilter.Stars));
            }
        }

        return Task.FromResult(filteredRestaurants.ToList());
    }

    public Restaurant? GetRestaurantById(int restaurantId)
    {
        var restaurant = restaurants.FirstOrDefault(r => r.Id == restaurantId);

        return restaurant;
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

}