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
    public class FilterController : CommonAttributesControllerBase
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        public FilterController(ISearchAndCompareApi api, IGeocoder geocoder)
        {
            _api = api;
            _geocoder = geocoder;
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
            
            return View("Subject", viewModel);
        }

        [HttpPost("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectPost(QueryFilter model)
        {
            model.page = null;

            var isInWizard = ViewBag.IsInWizard == true;
            return isInWizard
                ? RedirectToAction("FundingWizard", model.ToRouteValues())
                : RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("start/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardGet(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return SubjectGet(model);
        }

        [HttpPost("start/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardPost(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return SubjectPost(model);
        }

        [HttpPost("results/filter/fulltext")]
        [ActionName("FullText")]
        public IActionResult FullTextPost(QueryFilter model)
        {
            return !string.IsNullOrWhiteSpace(model.query)
                ? RedirectToAction("Index", "Results", model.WithoutLocation().ToRouteValues())
                : RedirectToAction("Location", model.ToRouteValuesWithError("Provider name is required"));
        }

        [HttpGet("results/filter/location")]
        public IActionResult Location(QueryFilter model, string error)
        {
            var viewModel = new LocationFilterViewModel {
                FilterModel = model
            };
            if (!string.IsNullOrWhiteSpace(error))
            {
                viewModel.Error = new ErrorViewModel(error);
            }


            return View("Location", viewModel);
        }

        [HttpPost("results/filter/location")]
        public async Task<IActionResult> Location(bool applyFilter, QueryFilter model)
        {
            var isInWizard = ViewBag.IsInWizard == true;
            model.query = null;

            if (!applyFilter)
            {
                return isInWizard
                    ? RedirectToAction("SubjectWizard", model.WithoutLocation().ToRouteValues())
                    : RedirectToAction("Index", "Results", model.WithoutLocation().ToRouteValues());
            }

            var coords = await _geocoder.ResolvePostCodeAsync(model.lq);
            if (coords == null) 
            {
                object redirectModel = model.ToRouteValuesWithError(
                    "Sorry, we couldn't find your location, please check your input and try again."
                );
                return RedirectToAction(isInWizard ? nameof(LocationWizard) : nameof(Location), redirectModel);
            }
            else
            {
                model.lat = coords.Latitude;
                model.lng = coords.Longitude;
                model.loc = coords.FormattedLocation;
                model.page = null;
                model.sortby = (int)SortByOption.Distance;
            }

            return isInWizard
                ? RedirectToAction("SubjectWizard", model.ToRouteValues())
                : RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("start/location")]
        public IActionResult LocationWizard(QueryFilter model, string error)
        {
            ViewBag.IsInWizard = true;
            return Location(model, error);
        }
        
        [HttpPost("start/location")]
        public async Task<IActionResult> LocationWizard(bool applyFilter, QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return await Location(applyFilter, model);
        }

        [HttpGet("results/filter/funding")]
        public IActionResult Funding(QueryFilter model)
        {
            return View("Funding", model);
        }

        [HttpPost("results/filter/funding")]
        public IActionResult Funding(int applyFilter, QueryFilter model)
        {
            model.page = null;

            if (applyFilter == 0)
            {
                model.funding = null;
                return RedirectToAction("Index", "Results", model.ToRouteValues());
            }
            model.funding = applyFilter;
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        
        [HttpGet("start/funding")]
        public IActionResult FundingWizard(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return Funding(model);
        }

        [HttpPost("start/funding")]
        public IActionResult FundingWizard(int applyFilter, QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return Funding(applyFilter, model);
        }
    }
}
