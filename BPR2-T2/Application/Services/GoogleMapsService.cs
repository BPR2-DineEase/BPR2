using Newtonsoft.Json.Linq;

namespace Application.Services;

public class GoogleMapsService : IGoogleMapsService
{
    private readonly HttpClient _httpClient;

    public GoogleMapsService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<(double Latitude, double Longitude)> GetCoordinatesAsync(string address, string city)
    {
        var apiKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY");
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("Google Maps API key is not configured.");
        }

        var encodedAddress = Uri.EscapeDataString($"{address}, {city}");
        var response = await _httpClient.GetStringAsync(
            $"https://maps.googleapis.com/maps/api/geocode/json?address={encodedAddress}&key={apiKey}");
        
        var json = JObject.Parse(response);
        var location = json["results"]?[0]?["geometry"]?["location"];
        if (location == null)
        {
            throw new Exception("Failed to retrieve coordinates from Google Maps.");
        }

        return (
            Latitude: location.Value<double>("lat"),
            Longitude: location.Value<double>("lng")
        );
    }
}