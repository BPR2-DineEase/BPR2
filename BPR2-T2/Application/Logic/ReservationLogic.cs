using System.Collections;
using Application.DaoInterfaces;
using Application.LogicInterfaces;
using Domain.Dtos.ReservationDtos;
using Domain.Models;

namespace Application.Logic;

public class ReservationLogic : IReservationsLogic
{
    private readonly IReservationsDao reservationsDao;

    public ReservationLogic(IReservationsDao reservationsDao)
    {
        this.reservationsDao = reservationsDao;
    }

    public async Task<Reservation> AddReservationAsync(Reservation addReservation)
    {
        
        var reservation = await reservationsDao.CreateReservation(addReservation);

        return reservation;
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
    {
        var reservations = await reservationsDao.GetReservations();

        return reservations;
    }

    public async Task<Reservation?> GetReservationByIdAsync(int id)
    {
        var reservation = await reservationsDao.GetReservationById(id);

        return reservation;
    }

}