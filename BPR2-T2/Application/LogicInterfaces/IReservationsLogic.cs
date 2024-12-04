using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.LogicInterfaces;

public interface IReservationsLogic
{
    Task<Reservation> AddReservationAsync(ReservationDto reservationDto);
    Task<IEnumerable<Reservation>> GetAllReservationsAsync();
    Task<Reservation?> GetReservationByIdAsync(int id);
    Task<IEnumerable<ReservationDto>> GetReservationsByUserIdAsync(Guid userId);
}