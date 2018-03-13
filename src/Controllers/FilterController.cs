using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Utils;
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
            if(!string.IsNullOrWhiteSpace(filter.query))
            {
                return RedirectToAction("Index", "Results", filter.WithoutLocation().ToRouteValues());
            }
            else
            {
                TempData.Put("Errors", new ErrorViewModel("query", "Provider name", "Provider name is required", Url.Action("Location")));
                return RedirectToAction("Location", filter.ToRouteValues());
            }
        }

        [HttpGet("results/filter/location")]
        [ActionName("LocationGet")]
        public IActionResult LocationGet(ResultsFilter filter)
        {
            var viewModel = new LocationFilterViewModel {
                FilterModel = filter
            };
            var errors = TempData.Get<ErrorViewModel>("Errors");
            if (errors != null && errors.AppliesToUrl(Url.Action("Location")))
            {
                viewModel.Errors = errors;
            }

            return View("Location", viewModel);
        }

        [HttpPost("results/filter/location")]
        [ActionName("Location")]
        public async Task<IActionResult> LocationPost(ResultsFilter filter)
        {
            var isInWizard = ViewBag.IsInWizard == true;
            filter.query = null;
            filter.page = null;


            if (filter.LocationOption == LocationOption.Unset)
            {
                TempData.Put("Errors", new ErrorViewModel("l", "Please make a selection", null, Url.Action("Location")));
                return RedirectToAction(isInWizard ? "LocationWizard" : "Location", filter.WithoutLocation().ToRouteValues());
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
                TempData.Put("Errors", new ErrorViewModel("lq", "Postcode, town or city name", "Sorry, we couldn't find your location, please check your input and try again.", Url.Action("Location")));
                
                return RedirectToAction(isInWizard ? "LocationWizard" : "Location", filter.ToRouteValues());
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
        [ActionName("LocationWizard")]
        public IActionResult LocationWizardGet(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return LocationGet(filter);
        }
        
        [HttpPost("start/location")]
        [ActionName("LocationWizard")]
        public async Task<IActionResult> LocationWizardPost(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return await LocationPost(filter);
        }

        [HttpGet("results/filter/funding")]
        public IActionResult Funding(ResultsFilter filter)
        {
            return View("Funding", filter);
        }

        [HttpPost("results/filter/funding")]
        public IActionResult Funding(bool applyFilter, bool includeBursary, bool includeScholarship, bool includeSalary, ResultsFilter filter)
        {
            filter.page = null;

            if (applyFilter) 
            {
                filter.SelectedFunding = FundingOption.AnyFunding;
                if (!includeBursary) filter.SelectedFunding = filter.SelectedFunding & ~FundingOption.Bursary;
                if (!includeScholarship) filter.SelectedFunding = filter.SelectedFunding & ~FundingOption.Scholarship;
                if (!includeSalary) filter.SelectedFunding = filter.SelectedFunding & ~FundingOption.Salary;
            }
            else 
            {
                filter.SelectedFunding = FundingOption.All;
            }
            
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        
        [HttpGet("start/funding")]
        public IActionResult FundingWizard(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return Funding(filter);
        }

        [HttpPost("start/funding")]
        public IActionResult FundingWizard(bool applyFilter, bool includeBursary, bool includeScholarship, bool includeSalary, ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            return Funding(applyFilter, includeBursary, includeScholarship, includeSalary, filter);
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
            model.page = null;
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
            model.page = null;
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }
    }
}
