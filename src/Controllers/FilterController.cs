using System.Globalization;
using System.Linq;
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

            ViewBag.Errors = TempData.Get<ErrorViewModel>("Errors");
            
            return View("Subject", viewModel);
        }

        [HttpPost("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectPost(ResultsFilter filter)
        {
            filter.page = null;

            var isInWizard = ViewBag.IsInWizard == true;
            if (!filter.SelectedSubjects.Any())
            {
                TempData.Put("Errors", new ErrorViewModel("subjects", "Please choose at least one subject", null, Url.Action("Subject")));
                return RedirectToAction(isInWizard ? "SubjectWizard" : "Subject", filter.ToRouteValues());
            }
            
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

        private IActionResult FullTextPost(ResultsFilter filter)
        {
            filter = filter.WithoutLocation();

            var isInWizard = ViewBag.IsInWizard == true;
            

            if(string.IsNullOrWhiteSpace(filter.query))
            {
                TempData.Put("Errors", new ErrorViewModel("query", "Training provider", "Please enter the name of a training provider", Url.Action("Location")));
                return RedirectToAction("Location", filter.ToRouteValues());
            }
            else if (false == _api.GetProviderSuggestions(filter.query).Any(x => string.Compare(filter.query, x.Name, CultureInfo.InvariantCulture, CompareOptions.IgnoreCase) == 0))
            {
                TempData.Put("Errors", new ErrorViewModel("query", "Training provider", "Please enter the name of a training provider", Url.Action("Location")));
                return RedirectToAction("Location", filter.ToRouteValues());
            }

            return isInWizard
                ? RedirectToAction("FundingWizard", filter.ToRouteValues())
                : RedirectToAction("Index", "Results", filter.ToRouteValues());
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
            filter.page = null;
   
            if (filter.LocationOption == LocationOption.Specific)
            {
                return FullTextPost(filter);
            }
            
            var isInWizard = ViewBag.IsInWizard == true;
            filter.query = null;

            if (filter.LocationOption == LocationOption.Unset)
            {
                TempData.Put("Errors", new ErrorViewModel("l", "Please choose an option", null, Url.Action("Location")));
                return RedirectToAction(isInWizard ? "LocationWizard" : "Location", filter.WithoutLocation().ToRouteValues());
            }

            if (filter.LocationOption == LocationOption.No)
            {
                /* PRIVATE_BETA_HACK */
                return isInWizard
                    ? RedirectToAction("FundingWizard", filter.WithoutLocation().ToRouteValues())
                    : RedirectToAction("Index", "Results", filter.WithoutLocation().ToRouteValues());
            }

            if (string.IsNullOrWhiteSpace(filter.lq)) 
            {
                TempData.Put("Errors", new ErrorViewModel("lq", "Postcode, town or city", "Please enter a postcode, city or town in England", Url.Action("Location")));
                return RedirectToAction(isInWizard ? "LocationWizard" : "Location", filter.ToRouteValues());            
            }

            var coords = await _geocoder.ResolvePostCodeAsync(filter.lq);
            if (coords == null) 
            {
                TempData.Put("Errors", new ErrorViewModel("lq", "Postcode, town or city", "We couldn't find this location, please check your input and try again.", Url.Action("Location")));
                
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

            /* PRIVATE_BETA_HACK */
            return isInWizard
                ? RedirectToAction("FundingWizard", filter.ToRouteValues())
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
            ViewBag.Errors = TempData.Get<ErrorViewModel>("Errors") ?? new ErrorViewModel();
            return View("Funding", filter);
        }

        [HttpPost("results/filter/funding")]
        public IActionResult Funding(bool? applyFilter, bool includeBursary, bool includeScholarship, bool includeSalary, ResultsFilter filter)
        {
            var isInWizard = ViewBag.IsInWizard == true;
            
            filter.page = null;

            if (!applyFilter.HasValue)
            {
                TempData.Put("Errors", new ErrorViewModel("applyFilter", "Please choose an option", null, Url.Action("Funding")));
                return RedirectToAction(isInWizard ? "FundingWizard" : "Funding", filter.ToRouteValues());
            }

            else if (applyFilter == true && !includeBursary && !includeScholarship && !includeSalary)
            {
                TempData.Put("Errors", new ErrorViewModel("funding", "Funding options", "Please choose at least one funding option", Url.Action("Funding")));
                return RedirectToAction(isInWizard ? "FundingWizard" : "Funding", filter.ToRouteValues());
            }
            else if (applyFilter == true)
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
        public IActionResult FundingWizard(bool? applyFilter, bool includeBursary, bool includeScholarship, bool includeSalary, ResultsFilter filter)
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
