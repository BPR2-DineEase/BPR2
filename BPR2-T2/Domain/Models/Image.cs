using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Models;

public class Image
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();  
    public string Uri { get; set; }                 
    public string? Name { get; set; }                
    public string? ContentType { get; set; }         
}