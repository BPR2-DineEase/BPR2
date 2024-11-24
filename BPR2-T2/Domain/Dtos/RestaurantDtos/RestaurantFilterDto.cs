namespace Domain.Dtos;

public class RestaurantFilterDto
{
    public string? Name { get; set; }
    public string? Cuisine { get; set; }
    public string? City { get; set; }
    
    public ReviewFilterDto? ReviewFilter { get; set; }
}