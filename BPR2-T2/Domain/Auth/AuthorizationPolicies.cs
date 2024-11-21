using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;

namespace Domain.Auth;

public static class AuthorizationPolicies
{
    public static void AddPolicies(IServiceCollection services)
    {
        services.AddAuthorizationCore(options =>
        {
            options.AddPolicy("MustBeRestaurantOwner", a =>
                a.RequireAuthenticatedUser().RequireClaim("Role", "RestaurantOwner"));
            
            options.AddPolicy("MustBeCustomer", a =>
                a.RequireAuthenticatedUser().RequireClaim("Role", "Customer"));
    
          
        });
    }
}