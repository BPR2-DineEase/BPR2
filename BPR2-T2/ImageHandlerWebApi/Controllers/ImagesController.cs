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
        var result = await service.ListBlobContainersAsync();
        return Ok(result);
    }

    [HttpPost("upload")]
    public async Task<ActionResult> UploadImage(IFormFile filename)
    {
        var result = await service.UploadBlobAsync(filename);
        return Ok();
    }

    [HttpDelete("delete/{filename}")]
    public async Task<ActionResult> DeleteImage(string filename)
    {
        return Ok();
    }
}