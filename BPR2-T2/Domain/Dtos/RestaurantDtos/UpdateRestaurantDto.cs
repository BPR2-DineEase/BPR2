namespace Domain.Dtos;

public class UpdateRestaurantDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string OpenHours { get; set; }
    public string Cuisine { get; set; }
    public string Info { get; set; }
    
    public int Capacity { get; set; }
    public List<string> ImageUris { get; set; }
}