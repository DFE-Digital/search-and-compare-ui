using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    public class DynamicController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        private readonly TelemetryClient _telemetryClient;

        public DynamicController(ISearchAndCompareApi api, IGeocoder geocoder, TelemetryClient telemetryClient)
        {
            _api = api;
            _geocoder = geocoder;
            _telemetryClient = telemetryClient;
        }

        [HttpGet("/dynamic/providersuggest")]
        public JsonResult ProviderSuggest(string query)
        {
            var res = _api.GetProviderSuggestions(query);
            return Json(res.Select(x => new { name = x.Name, providerCode = x.ProviderCode }).ToList());
        }

        [HttpGet("/dynamic/locationsuggest")]
        public async Task<JsonResult> LocationSuggest(string query)
        {
            IEnumerable<string> res = new List<string>();

            try
            {
                res = await _geocoder.SuggestLocationsAsync(query);
            }
            catch (Exception ex)
            {
                _telemetryClient.TrackException(ex);
            }

            return Json(res.Count() > 5 ? res.Take(5) : res);
        }
    }
}
