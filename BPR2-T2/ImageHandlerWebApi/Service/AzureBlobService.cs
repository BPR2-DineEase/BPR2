using Azure.Storage;
using Azure.Storage.Blobs;
using Shared.Dtos.ImageHandlerDtos;

namespace ImageHandlerWebApi.Service;

public class AzureBlobService
{
    private readonly string? _storageAccount;
    private readonly string? _accessKey;
    private readonly BlobContainerClient _imagesContainer;
    
    public AzureBlobService(IConfiguration configuration)
    {
        _storageAccount = configuration["AzureBlob:storageAccount"];
        _accessKey = configuration["AzureBlob:accessKey"];
        
        var credential = new StorageSharedKeyCredential(_storageAccount, _accessKey);
        var blobUri = $"https://{_storageAccount}.blob.core.windows.net";
        var blobServiceClient = new BlobServiceClient(new Uri(blobUri), credential);
        _imagesContainer = blobServiceClient.GetBlobContainerClient("bpr2imagecontainer");
    }

    public async Task<List<BlobDto>> ListBlobContainersAsync()
    {
        List<BlobDto> images = new List<BlobDto>();

        await foreach (var image in _imagesContainer.GetBlobsAsync())
        {
            string uri = _imagesContainer.Uri.ToString();
            string name = image.Name;
            var fullUri = $"{uri}/{name}";
            
            images.Add(new BlobDto
            {
                Uri = fullUri,
                Name = name,
                ContentType = image.Properties.ContentType,
            });
        }
        
        return images;
    }

    public async Task<BlobResponseDto> UploadBlobAsync(IFormFile blob)
    {
        BlobResponseDto blobResponseDto = new();
        BlobClient client = _imagesContainer.GetBlobClient(blob.FileName);

        await using (Stream? data = blob.OpenReadStream())
        {
            await client.UploadAsync(data);
        }
        
        blobResponseDto.Status = $"Image {blob.FileName} Uploaded successfully";
        blobResponseDto.Error = false;
        blobResponseDto.Blob.Uri = client.Uri.AbsoluteUri;
        blobResponseDto.Blob.Name = blob.Name;
        
        return blobResponseDto;
    }



}