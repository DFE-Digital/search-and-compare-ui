using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class FilterController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        public FilterController(ISearchAndCompareApi api, IGeocoder geocoder)
        {
            _api = api;
            _geocoder = geocoder;
        }

        [HttpPost("results/filter/sortby")]
        public IActionResult SortBy(QueryFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectGet(QueryFilter model)
        {
            var subjectAreas = _api.GetSubjectAreas();

            var viewModel = new SubjectFilterViewModel {
                SubjectAreas = subjectAreas,
                FilterModel = model
            };
            
            return View(viewModel);
        }

        [HttpPost("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectPost(QueryFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("results/filter/location")]
        public IActionResult Location(QueryFilter model)
        {
            return View(model);
        }

        [HttpPost("results/filter/location")]
        public async Task<IActionResult> Location(bool applyFilter, QueryFilter model)
        {
            if (!applyFilter)
            {
                model.lat = null;
                model.lng = null;
                model.loc = null; 
                model.rad = null;
                model.page = null;
                return RedirectToAction("Index", "Results", model.ToRouteValues());
            }

            var coords = await _geocoder.ResolvePostCodeAsync(model.loc);
            if (coords == null) 
            {
                return RedirectToAction(nameof(Location));
            }
            else
            {
                model.lat = coords.Latitude;
                model.lng = coords.Longitude;
                model.loc = coords.FormattedLocation;
                model.page = null;
                model.sortby = (int)SortByOption.Distance;
            }

            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }
    }
}
