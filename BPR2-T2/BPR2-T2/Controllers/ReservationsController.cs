using BPR2_T2.Data;
using BPR2_T2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BPR2_T2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly ReservationContext _context;

    public ReservationsController(ReservationContext context)
    {
        _context = context;
    }

    // POST: api/Reservations
    [HttpPost]
    public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
    {
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        // Ensure that "GetReservation" matches the method name of the action below
        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
    }

    // GET: api/Reservations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
    {
        return await _context.Reservations.ToListAsync();
    }

    // GET: api/Reservations/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Reservation>> GetReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        
        if (reservation == null)
        {
            return NotFound();
        }
        
        return Ok(reservation);
    }
}

