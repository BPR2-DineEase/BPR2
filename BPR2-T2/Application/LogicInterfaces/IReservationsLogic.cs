using Domain.Dtos;
using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.LogicInterfaces;

public interface IReservationsLogic
{
    Task<Reservation> AddReservationAsync(ReservationDto reservationDto);
    Task<IEnumerable<Reservation>> GetAllReservationsAsync();
    Task<Reservation?> GetReservationByIdAsync(int id);
    Task<IEnumerable<ReservationWithRestaurantDto>> GetUserReservationsAsync(Guid userId);
    Task UpdateReservationAsync(UpdateReservationDto updateReservationDto);
    Task DeleteReservationAsync(int id);
    Task<IEnumerable<Reservation>> GetReservationsByRestaurantIdAsync(int restaurantId);
    Task<string> SendReservationConfirmationEmailAsync(Reservation reservation);
    Task<string> SendReservationUpdateEmailAsync(Reservation reservation);
    Task<string> SendReservationDeletionEmailAsync(Reservation reservation);
}