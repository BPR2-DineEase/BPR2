using Domain.Dtos;
using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.DaoInterfaces;

public interface IReservationsDao
{
    Task<Reservation> CreateReservation(Reservation addReservation);
    Task<Reservation?> GetReservationById(int id);
    Task<IEnumerable<Reservation>> GetReservations();
    Task<IEnumerable<ReservationWithRestaurantDto>> GetUserReservationsAsync(Guid userId);
    Task UpdateReservationAsync(Reservation reservation);
    Task DeleteReservationAsync(Reservation reservation);
    Task<IEnumerable<Reservation>> GetReservationsByRestaurantIdAsync(int restaurantId);
    Task<ReservationNotificationDto> CreateReservationNotificationDto(Reservation reservation);
}