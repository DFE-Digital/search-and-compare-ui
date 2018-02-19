using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public interface IGeocoder
    {
        Task<Coordinates> ResolvePostCodeAsync(string postCode);
    }
}