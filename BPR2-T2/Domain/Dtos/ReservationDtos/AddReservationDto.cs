namespace Domain.Dtos.ReservationDtos;

public class AddReservationDto
{
    public int Id { get; set; }
    public string GuestName { get; set; }
    public string PhoneNumber { get; set; }
    public string Company { get; set; }
    public string Email { get; set; }
    public string Comments { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; }
    public int NumOfPeople { get; set; }
}