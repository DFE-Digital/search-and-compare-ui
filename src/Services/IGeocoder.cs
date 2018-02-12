using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public interface IGeocoder
    {
        Task<Coordinates> ResolvePostCodeAsync(string postCode);
    }
}