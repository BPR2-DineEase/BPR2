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
                Password = userRegisterDto.Password,
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

            return Ok(new { Otp = otp });
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
}