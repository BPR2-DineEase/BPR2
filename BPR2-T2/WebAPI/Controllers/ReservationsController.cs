using Application.LogicInterfaces;
using Domain.Dtos.ReservationDtos;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly IReservationsLogic _reservationsLogic;

    public ReservationsController(IReservationsLogic reservationsLogic)
    {
        _reservationsLogic = reservationsLogic;
    }

    [HttpPost]
    public async Task<ActionResult<Reservation>> PostReservation(Reservation dto)
    {
        try
        {
            var reservation = await _reservationsLogic.AddReservationAsync(dto);
            return Created($"$/reservations/{reservation.Id}", reservation);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
    {
        try
        {
            var reservations = await _reservationsLogic.GetAllReservationsAsync();
            return Ok(reservations);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Reservation>> GetReservation([FromRoute]int id)
    {
        try
        {
            var reservation = await _reservationsLogic.GetReservationByIdAsync(id);
            return Ok(reservation);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }
}