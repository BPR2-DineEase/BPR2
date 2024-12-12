using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.LogicInterfaces;
using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;


namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthLogic _authLogic;

    public AuthController(IAuthLogic authLogic)
    {
        _authLogic = authLogic;
    }

    [HttpPost, Route("register")]
    public async Task<ActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
        try
        {
            var user = new User
            {
                Id = userRegisterDto.Id,
                Email = userRegisterDto.Email,
                PasswordHash = userRegisterDto.Password,
                FirstName = userRegisterDto.FirstName,
                LastName = userRegisterDto.LastName,
                Role = userRegisterDto.Role
            };

            await _authLogic.RegisterUser(userRegisterDto);
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost, Route("login")]
    public async Task<ActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        try
        {
            string token = await _authLogic.LoginUser(userLoginDto.Email, userLoginDto.Password);
            return Ok(token);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }


    [HttpPost, Route("generate-reset-otp")]
    public async Task<ActionResult> GenerateResetOtp([FromBody] string email)
    {
        try
        {
            var otp = await _authLogic.GeneratePasswordResetOtp(email);

            Console.WriteLine($"Reset otp for {email}: {otp}");

            return Ok(new {Otp = otp});
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error: {e.Message}");
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost, Route("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] PasswordResetDto resetDto)
    {
        try
        {
            await _authLogic.ResetPassword(resetDto);
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet, Route("{id:Guid}")]
    public async Task<ActionResult<User>> GetUserById([FromRoute] Guid id)
    {
        try
        {
            var user = await _authLogic.GetUserById(id);
            return Ok(user);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpGet("user-email/{email}")]
    public async Task<ActionResult<User>> GetUserByEmail(string email)
    {
        try
        {
            var decodedEmail = Uri.UnescapeDataString(email);
            var user = await _authLogic.GetUserByEmail(decodedEmail);
            if (user == null)
            {
                return NotFound(new {message = "User not found"});
            }

            return Ok(user);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }


    [HttpGet, Route("user-credentials")]
    public async Task<ActionResult<User>> GetUserByCredentials([FromQuery] UserCredentialsDto dto)
    {
        try
        {
            var user = await _authLogic.GetUserCredentials(dto);
            return Ok(user);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, e.Message);
        }
    }

    [HttpPost, Route("addRestaurantToUser")]
    public async Task<ActionResult<User>> AddRestaurantToUser([FromQuery] Guid userId, [FromQuery] int restaurantId)
    {
        try
        {
            Console.WriteLine($"Controller: userId={userId}, restaurantId={restaurantId}");
            var user = await _authLogic.addRestaurantToUser(userId, restaurantId);
            return Ok(user);
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error in AddRestaurantToUser: {e}");
            return StatusCode(500, e.Message);
        }
    }
    
    [HttpPut("{id}/update")]
    public async Task<ActionResult> UpdateUserProfile(Guid id, [FromBody] UpdateUserProfileDto updateUserProfileDto)
    {
        if (updateUserProfileDto == null)
        {
            return BadRequest("Invalid user data.");
        }

        if (id != updateUserProfileDto.Id)
        {
            return BadRequest("User ID mismatch.");
        }

        try
        {
            await _authLogic.UpdateUserProfileAsync(updateUserProfileDto);
            return NoContent();
        }
        catch (Exception e)
        {
            Console.Error.WriteLine(e);
            return StatusCode(500, "An error occurred while updating the profile.");
        }
    }

}