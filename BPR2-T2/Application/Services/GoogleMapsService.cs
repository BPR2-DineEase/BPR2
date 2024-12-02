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
            $"https://api.mapbox.com/geocoding/v5/mapbox.places/{encodedAddress}.json?access_token={apiKey}");
        var json = JObject.Parse(response);
        var location = json["features"]?[0]?["geometry"]?["coordinates"];
        if (location == null || location.Count() < 2)
        {
            throw new Exception("Failed to retrieve coordinates from Google Maps.");
        }

        return (
            Latitude: location[1].Value<double>(),
            Longitude: location[0].Value<double>()
        );
    }
}