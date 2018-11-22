using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public interface IGeocoder
    {
        Task<GeocodingResult> ResolveAddressAsync(string postCode);
        Task<IEnumerable<string>> SuggestLocationsAsync(string input);
    }
}
