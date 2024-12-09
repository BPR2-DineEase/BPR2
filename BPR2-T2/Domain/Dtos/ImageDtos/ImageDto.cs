namespace Domain.Dtos;

public class ImageDto
{
    public Guid Id { get; set; }
    public string Uri { get; set; }
    public string Name { get; set; }
    public string ContentType { get; set; }
    public string Type { get; set; }
}