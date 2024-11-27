namespace Application.Services;

public interface IGoogleMapsService
{
    Task<(double Latitude, double Longitude)> GetCoordinatesAsync(string address, string city);
}
