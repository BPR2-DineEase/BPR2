namespace Domain.Dtos;

public class CreateRestaurantDto
{
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string OpenHours { get; set; }
    public string Cuisine { get; set; }
    public string Info { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}