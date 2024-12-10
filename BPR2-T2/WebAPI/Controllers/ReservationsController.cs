using System.ComponentModel.DataAnnotations;
using Application.LogicInterfaces;
using Domain.Dtos;
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
            
            var notification = await _reservationsLogic.CreateReservationNotificationDto(reservation);
            
            await _reservationsLogic.SendReservationConfirmationEmailsAsync(notification);

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
    public async Task<ActionResult<IEnumerable<ReservationWithRestaurantDto>>> GetUserReservationsAsync([FromRoute] Guid userId)
    {
        try
        {
            var reservations = await _reservationsLogic.GetUserReservationsAsync(userId);
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
    
    
    [HttpPut("{id}/update")]
    public async Task<ActionResult> UpdateReservation(int id, [FromBody] UpdateReservationDto updateReservationDto)
    {
        if (id != updateReservationDto.Id)
        {
            return BadRequest("Reservation ID mismatch.");
        }

        try
        {
            await _reservationsLogic.UpdateReservationAsync(updateReservationDto);
            
            var updatedReservation = await _reservationsLogic.GetReservationByIdAsync(updateReservationDto.Id);
            
            var notification = await _reservationsLogic.CreateReservationNotificationDto(updatedReservation);
            
            await _reservationsLogic.SendReservationUpdateEmailAsync(updatedReservation);

            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    [HttpDelete("{id}/cancel")]
    public async Task<ActionResult> DeleteReservation(int id)
    {
        try
        {
            var reservation = await _reservationsLogic.GetReservationByIdAsync(id);
            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }
            
            var notification = await _reservationsLogic.CreateReservationNotificationDto(reservation);
            
            await _reservationsLogic.SendReservationDeletionEmailAsync(reservation);
            
            await _reservationsLogic.DeleteReservationAsync(id);
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }
}