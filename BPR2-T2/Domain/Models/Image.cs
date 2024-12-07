using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain.Models;

public class Image
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; } = Guid.Empty;  
    public string Uri { get; set; }                 
    public string? Name { get; set; }                
    public string? ContentType { get; set; }
    public string? Type { get; set; }
    
    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; }
    
    public Image() { }
    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; }
}