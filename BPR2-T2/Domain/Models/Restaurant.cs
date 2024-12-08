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
    public int Capacity { get; set; } 
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Image> Images { get; set; }
    public ICollection<Reservation> Reservations { get; set; }
    public Restaurant()
    {

    }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    
}