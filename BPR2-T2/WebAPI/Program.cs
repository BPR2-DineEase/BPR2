using Application.DaoInterfaces;
using Application.Logic;
using Application.LogicInterfaces;
using EfcDataAccess.Context;
using EfcDataAccess.DAOs;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IReservationsLogic, ReservationLogic>();
builder.Services.AddScoped<IRestaurantsLogic, RestaurantsLogic>();

builder.Services.AddScoped<IReservationsDao, ReservationsEfcDao>();
builder.Services.AddScoped<IRestaurantsDao, RestaurantEfcDao>();

builder.Services.AddDbContext<ReservationContext>();

var app = builder.Build();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true) // allow any origin
    .AllowCredentials());


app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();