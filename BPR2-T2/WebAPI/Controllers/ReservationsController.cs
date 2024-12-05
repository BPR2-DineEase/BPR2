using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.LogicInterfaces;
using Domain.Dtos.ReservationDtos;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

    [HttpPost, Route("create")]
    public async Task<ActionResult> CreateReservation([FromBody] ReservationDto reservationDto)
    {
        try
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID not found in token.");
            }
            
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                Console.WriteLine($"Invalid userId format: {userIdClaim}");
                return BadRequest("Invalid userId format in token.");
            }
            
            reservationDto.UserId = userId;
            var reservation = await _reservationsLogic.AddReservationAsync(reservationDto);
            return Ok(reservation);
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
    
    [HttpGet, Route("{userId}/reservations")]
    public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservationsByUserId(Guid userId)
    {
        try
        {
            var reservations = await _reservationsLogic.GetReservationsByUserIdAsync(userId);
            return Ok(reservations);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}