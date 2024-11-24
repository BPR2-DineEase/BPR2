using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Models;

public class Restaurant 
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string OpenHours { get; set; }
    public string Cuisine { get; set; }
    public string Info { get; set; }
    [JsonIgnore]
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Image> Images { get; set; }
    
    public Restaurant()
    {
        Images = new List<Image>();
    }
}