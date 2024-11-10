using System;
using System.IO;

namespace Shared.Dtos.ImageHandlerDtos;

public class BlobDto
{
    public Guid Id { get; set; }               
    public string? Uri { get; set; }            
    public string? Name { get; set; }          
    public string? ContentType { get; set; }   
}
