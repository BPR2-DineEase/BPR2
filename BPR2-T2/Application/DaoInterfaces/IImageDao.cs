using Domain.Models;

namespace Application.DaoInterfaces;

public interface IImageDao
{
    Task AddImagesAsync(IEnumerable<Image> images);
}