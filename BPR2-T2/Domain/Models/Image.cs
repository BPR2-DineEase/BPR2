using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Models;

public class Image
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();  
    public string Uri { get; set; }                 
    public string? Name { get; set; }                
    public string? ContentType { get; set; }         
    [JsonIgnore]
    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; }
}