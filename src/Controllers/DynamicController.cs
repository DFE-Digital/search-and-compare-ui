using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    public class DynamicController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        public DynamicController(ISearchAndCompareApi api, IGeocoder geocoder)
        {
            _api = api;
            _geocoder = geocoder;
        }

        [HttpGet("/dynamic/providersuggest")]
        public JsonResult ProviderSuggest(string query)
        {
            var res = _api.GetProviderSuggestions(query);
            return Json(res
                .Select(x => x.Name)
                .ToList());
        }

        [HttpGet("/dynamic/locationsuggest")]
        public async Task<JsonResult> LocationSuggest(string query)
        {
            var res = await _geocoder.SuggestLocationsAsync(query);
            return Json(res.Count() > 5 ? res.Take(5) : res);
        }
    }
}
