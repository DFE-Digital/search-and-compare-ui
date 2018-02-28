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
            var isInWizard = ViewBag.IsInWizard == true;
            return isInWizard
                ? RedirectToAction("FundingWizard", model.ToRouteValues())
                : RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("wizard/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardGet(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return SubjectGet(model);
        }

        [HttpPost("wizard/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardPost(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return SubjectPost(model);
        }

        [HttpGet("results/filter/location")]
        public IActionResult Location(QueryFilter model)
        {
            return View("Location", model);
        }

        [HttpPost("results/filter/location")]
        public async Task<IActionResult> Location(bool applyFilter, QueryFilter model)
        {
            var isInWizard = ViewBag.IsInWizard == true;
            if (!applyFilter)
            {
                model.lat = null;
                model.lng = null;
                model.loc = null; 
                model.rad = null;
                model.page = null;
                return isInWizard
                    ? RedirectToAction("SubjectWizard", model.ToRouteValues())
                    : RedirectToAction("Index", "Results", model.ToRouteValues());
            }

            var coords = await _geocoder.ResolvePostCodeAsync(model.loc);
            if (coords == null) 
            {
                return RedirectToAction(isInWizard ? nameof(LocationWizard) : nameof(Location));
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

        [HttpGet("wizard/location")]
        public IActionResult LocationWizard(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return Location(model);
        }
        
        [HttpPost("wizard/location")]
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
            if (applyFilter == 0)
            {
                model.funding = null;
                return RedirectToAction("Index", "Results", model.ToRouteValues());
            }
            model.funding = applyFilter;
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        
        [HttpGet("wizard/funding")]
        public IActionResult FundingWizard(QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return Funding(model);
        }

        [HttpPost("wizard/funding")]
        public IActionResult FundingWizard(int applyFilter, QueryFilter model)
        {
            ViewBag.IsInWizard = true;
            return Funding(applyFilter, model);
        }
    }
}
