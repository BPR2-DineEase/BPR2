namespace Domain.Dtos.ReservationDtos;

public class ReservationNotificationDto
{
    public string GuestName { get; set; }
    public string GuestEmail { get; set; }
    public string RestaurantOwnerName { get; set; }
    public string RestaurantOwnerEmail { get; set; }
    public string RestaurantName { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; }
    public int NumOfPeople { get; set; }
    public string Comments { get; set; }
    public string SupportEmail { get; set; } = "support@dineease.dk";
}
