using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.LogicInterfaces;

public interface IReservationsLogic
{
    Task<Reservation> AddReservationAsync(Reservation addReservation);
    Task<IEnumerable<Reservation>> GetAllReservationsAsync();
    Task<Reservation?> GetReservationByIdAsync(int id);
}