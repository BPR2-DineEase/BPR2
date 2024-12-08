using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models;

public class Reservation
{
    [Key]
    public int Id { get; set; }
    public string GuestName { get; set; }
    public string PhoneNumber { get; set; }
    public string Company { get; set; }
    public string Email { get; set; }
    public string Comments { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; }
    public int NumOfPeople { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public int RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; }
}