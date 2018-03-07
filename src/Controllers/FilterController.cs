using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;
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
        public IActionResult SubjectGet(ResultsFilter filter)
        {
            var subjectAreas = _api.GetSubjectAreas();

            var viewModel = new SubjectFilterViewModel {
                SubjectAreas = subjectAreas,
                FilterModel = filter
            };
            
            return View("Subject", viewModel);
        }

        [HttpPost("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectPost(ResultsFilter filter)
        {
            filter.page = null;

            var isInWizard = ViewBag.IsInWizard == true;
            return isInWizard
                ? RedirectToAction("FundingWizard", filter.ToRouteValues())
                : RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        [HttpGet("start/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardGet(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return SubjectGet(filter);
        }

        [HttpPost("start/subject")]
        [ActionName("SubjectWizard")]
        public IActionResult SubjectWizardPost(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return SubjectPost(filter);
        }

        [HttpPost("results/filter/fulltext")]
        [ActionName("FullText")]
        public IActionResult FullTextPost(ResultsFilter filter)
        {
            return !string.IsNullOrWhiteSpace(filter.query)
                ? RedirectToAction("Index", "Results", filter.WithoutLocation().ToRouteValues())
                : RedirectToAction("Location", filter.ToRouteValuesWithError("Provider name is required"));
        }

        [HttpGet("results/filter/location")]
        public IActionResult Location(ResultsFilter filter, string error)
        {
            var viewModel = new LocationFilterViewModel {
                FilterModel = filter
            };
            if (!string.IsNullOrWhiteSpace(error))
            {
                viewModel.Error = new ErrorViewModel(error);
            }


            return View("Location", viewModel);
        }

        [HttpPost("results/filter/location")]
        public async Task<IActionResult> Location(ResultsFilter filter)
        {
            var isInWizard = ViewBag.IsInWizard == true;
            filter.query = null;

            if (filter.LocationOption == LocationOption.Unset)
            {
                return isInWizard
                    ? RedirectToAction("LocationWizard",
                        filter.WithoutLocation().ToRouteValuesWithError("Please make a selection."))
                    : RedirectToAction("Location", "Filter",
                        filter.WithoutLocation().ToRouteValuesWithError("Please make a selection."));
            }

            if (filter.LocationOption == LocationOption.No)
            {
                return isInWizard
                    ? RedirectToAction("SubjectWizard", filter.WithoutLocation().ToRouteValues())
                    : RedirectToAction("Index", "Results", filter.WithoutLocation().ToRouteValues());
            }

            var coords = await _geocoder.ResolvePostCodeAsync(filter.lq);
            if (coords == null) 
            {
                object redirectModel = filter.ToRouteValuesWithError(
                    "Sorry, we couldn't find your location, please check your input and try again."
                );
                return RedirectToAction(isInWizard ? nameof(LocationWizard) : nameof(Location), redirectModel);
            }
            else
            {
                filter.lat = coords.Latitude;
                filter.lng = coords.Longitude;
                filter.loc = coords.FormattedLocation;
                filter.page = null;
                filter.sortby = (int)SortByOption.Distance;
            }

            return isInWizard
                ? RedirectToAction("SubjectWizard", filter.ToRouteValues())
                : RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        [HttpGet("start/location")]
        public IActionResult LocationWizard(ResultsFilter filter, string error)
        {
            ViewBag.IsInWizard = true;
            return Location(filter, error);
        }
        
        [HttpPost("start/location")]
        public async Task<IActionResult> LocationWizard(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return await Location(filter);
        }

        [HttpGet("results/filter/funding")]
        public IActionResult Funding(ResultsFilter filter)
        {
            return View("Funding", filter);
        }

        [HttpPost("results/filter/funding")]
        public IActionResult Funding(int applyFilter, ResultsFilter filter)
        {
            filter.page = null;

            if (applyFilter == 0)
            {
                filter.funding = null;
                return RedirectToAction("Index", "Results", filter.ToRouteValues());
            }
            filter.funding = applyFilter;
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        
        [HttpGet("start/funding")]
        public IActionResult FundingWizard(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return Funding(filter);
        }

        [HttpPost("start/funding")]
        public IActionResult FundingWizard(int applyFilter, ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return Funding(applyFilter, filter);
        }

        [HttpGet("results/filter/qualification")]
        [ActionName("Qualification")]
        public IActionResult QualificationGet(ResultsFilter model)
        {
            return View(model);
        }
        
        [HttpPost("results/filter/qualification")]
        [ActionName("Qualification")]
        public IActionResult QualificationPost(ResultsFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

        [HttpGet("results/filter/studytype")]
        [ActionName("StudyType")]
        public IActionResult StudyType(ResultsFilter model)
        {
            return View(model);
        }
        
        [HttpPost("results/filter/studytype")]
        [ActionName("StudyType")]
        public IActionResult StudyTypePost(ResultsFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }
    }
}
