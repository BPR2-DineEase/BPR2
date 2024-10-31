namespace Shared.Models;

public class Restaurant 
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    
    public string OpenHours { get; set; }
    public string Cousine { get; set; }
    public string Info { get; set; }
    public ICollection<Review> Reviews { get; set; }
}