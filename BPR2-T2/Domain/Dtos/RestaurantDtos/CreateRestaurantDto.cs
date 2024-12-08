namespace Domain.Dtos.RestaurantDtos;

public class CreateRestaurantDto
{
    public string Name { get; set; }
    public string Address { get; set; } 
    public string City { get; set; }
    public string OpenHours { get; set; }
    public string Cuisine { get; set; }
    public string Info { get; set; }
    public int Capacity { get; set; }
    public List<string>? ImageTypes { get; set; }
}