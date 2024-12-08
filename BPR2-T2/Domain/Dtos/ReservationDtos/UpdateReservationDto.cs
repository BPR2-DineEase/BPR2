namespace Domain.Dtos.ReservationDtos;

public class UpdateReservationDto
{
    public int Id { get; set; }
    public string GuestName { get; set; }
    public string Comments { get; set; }
    public DateTime Date { get; set; }
    public string Time { get; set; }
    public int NumOfPeople { get; set; }
   
}
