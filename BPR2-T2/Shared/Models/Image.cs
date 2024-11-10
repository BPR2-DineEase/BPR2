using System;

namespace Shared.Models;

public class Image
{
    public Guid Id { get; set; } = Guid.NewGuid();  
    public string Uri { get; set; }                 
    public string Name { get; set; }                
    public string ContentType { get; set; }         
}