using ImageHandlerWebApi.Service;
using Microsoft.AspNetCore.Mvc;

namespace ImageHandlerWebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly AzureBlobService service;

    public ImagesController(AzureBlobService service)
    {
        this.service = service;
    }

    [HttpGet("list")]
    public async Task<ActionResult> ListAllImages()
    {
        var images = await service.ListBlobContainersAsync();

        var imageUrls = images.Select(img => img.Uri).ToList();
        return Ok(imageUrls);
    }

    [HttpPost("upload")]
    public async Task<ActionResult> UploadImage(IFormFile file)
    {
        await service.UploadImageAsync(file);
        return Ok();
    }

    [HttpDelete("delete/{filename}")]
    public async Task<ActionResult> DeleteImage(string filename)
    {
        return Ok();
    }
}