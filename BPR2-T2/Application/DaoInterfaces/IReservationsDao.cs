using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.DaoInterfaces;

public interface IReservationsDao
{
    Task<Reservation> CreateReservation(Reservation addReservation);
    Task<Reservation?> GetReservationById(int id);
    Task<IEnumerable<Reservation>> GetReservations();
    Task<IEnumerable<Reservation>> GetReservationsByUserId(Guid userId);
}