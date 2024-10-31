using Shared.Models;

namespace Shared.Dtos;

public class RestaurantFilterDto
{
    public string Name { get; set; }
    public string Address { get; set; }
    public string Cousine { get; set; }
    public ICollection<Review> Reviews { get; set; }

}