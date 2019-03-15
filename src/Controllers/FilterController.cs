using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Services;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Utils;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    public class FilterController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        private readonly IGeocoder _geocoder;

        private readonly TelemetryClient _telemetryClient;

        private readonly GoogleAnalyticsClient _gaClient;

        public FilterController(ISearchAndCompareApi api, IGeocoder geocoder, TelemetryClient telemetryClient, GoogleAnalyticsClient gaClient)
        {
            _api = api;
            _geocoder = geocoder;
            _telemetryClient = telemetryClient;
            _gaClient = gaClient;
        }

        [HttpGet("results/filter/subject")]
        [ActionName("Subject")]
        public IActionResult SubjectGet(ResultsFilter filter)
        {
            var subjectAreas = _api.GetSubjectAreas();

            var viewModel = new SubjectFilterViewModel
            {
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
            if (!filter.SelectedSubjects.Any() && !filter.senCourses)
            {
                TempData.Put("Errors", new ErrorViewModel("subjects", "Please choose at least one subject", null, Url.Action("Subject")));
                return RedirectToAction(isInWizard ? "SubjectWizard" : "Subject", filter.ToRouteValues());
            }

            return RedirectToAction("Index", "Results", filter.ToRouteValues());
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
            var queryIsEmpty = string.IsNullOrWhiteSpace(filter.query);

            if (queryIsEmpty)
            {
                TempData.Put("Errors", new ErrorViewModel("query", "Training provider", "Please enter the name of a training provider", Url.Action("Location")));
                return RedirectToAction("Location", filter.ToRouteValues());
            }

            var suggestions = _api.GetProviderSuggestions(filter.query);
            var noSuggestions = suggestions.Count == 0;

            // Note: this is the same block of code as the above. It's repeated because hoisting the logic for
            // the _api.GetProviderSuggestions call would make it call needlessly on queries which are empty.
            if (noSuggestions)
            {
                TempData.Put("Errors", new ErrorViewModel("query", "Training provider", "Please enter the name of a training provider", Url.Action("Location")));
                return RedirectToAction("Location", filter.ToRouteValues());
            }

            var queryIsExactMatch = suggestions.Any(x => x.Name.Equals(filter.query, StringComparison.InvariantCultureIgnoreCase));

            if (!queryIsExactMatch)
            {
                TempData.Put("Suggestions", suggestions);
                return RedirectToAction("Provider", filter.ToRouteValues());
            }

            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }


        [HttpGet("results/filter/location")]
        [ActionName("LocationGet")]
        public IActionResult LocationGet(ResultsFilter filter)
        {
            var viewModel = new LocationFilterViewModel
            {
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
                return isInWizard
                    ? RedirectToAction("SubjectWizard", filter.WithoutLocation().ToRouteValues())
                    : RedirectToAction("Index", "Results", filter.WithoutLocation().ToRouteValues());
            }

            if (string.IsNullOrWhiteSpace(filter.lq))
            {
                TempData.Put("Errors", new ErrorViewModel("lq", "Postcode, town or city", "Please enter a postcode, city or town in England", Url.Action("Location")));
                return RedirectToAction(isInWizard ? "LocationWizard" : "Location", filter.ToRouteValues());
            }

            var coords = await ResolveAddressAsync(filter.lq);
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

                var cid = Request.Cookies.TryGetValue("_gid", out string gid) ? gid : "";

                _gaClient.TrackEvent(cid, "Form: Location", "Selected Granularity", coords.Granularity);
                _gaClient.TrackEvent(cid, "Form: Location", "Selected Region", coords.Region);
            }

            return isInWizard
                ? RedirectToAction("SubjectWizard", filter.ToRouteValues())
                : RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        [HttpGet("/")]
        [ActionName("LocationWizard")]
        public IActionResult LocationWizardGet(ResultsFilter filter)
        {
            ViewBag.IsInWizard = true;
            //filter.qualification = filter.qualification.Any() ? filter.qualification : new List<QualificationOption> { QualificationOption.QtsOnly, QualificationOption.PgdePgceWithQts, QualificationOption.Other };
            filter.qualifications = !string.IsNullOrWhiteSpace(filter.qualifications) ? filter.qualifications : string.Join(",", Enum.GetNames(typeof(QualificationOption)));

            return LocationGet(filter);
        }

        [HttpPost("/")]
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
            filter.page = null;

            if (!applyFilter.HasValue)
            {
                TempData.Put("Errors", new ErrorViewModel("applyFilter", "Please choose an option", null, Url.Action("Funding")));
                return RedirectToAction("Funding", filter.ToRouteValues());
            }

            else if (applyFilter == true && !includeBursary && !includeScholarship && !includeSalary)
            {
                TempData.Put("Errors", new ErrorViewModel("funding", "Funding options", "Please choose at least one funding option", Url.Action("Funding")));
                return RedirectToAction("Funding", filter.ToRouteValues());
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


        [HttpGet("results/filter/qualification")]
        [ActionName("Qualification")]
        public IActionResult QualificationGet(ResultsFilter model)
        {
            // Put the posted qualifications into a comma separated string
            model.qualifications = model.qualification.Any() ? string.Join(",", model.qualification.Select(q => Enum.GetName(typeof(QualificationOption), q))) : string.Join(",", Enum.GetNames(typeof(QualificationOption)));
            model.qualification = new List<QualificationOption>(); // Remove this from the url
            return View(model);
        }

        [HttpPost("results/filter/qualification")]
        [ActionName("Qualification")]
        public IActionResult QualificationPost(ResultsFilter model)
        {
            model.page = null;
            // Put the posted qualifications into a comma separated string
            model.qualifications = model.qualification.Any() ? string.Join(",", model.qualification.Select(q => Enum.GetName(typeof(QualificationOption), q))) : string.Join(",", Enum.GetNames(typeof(QualificationOption)));
            model.qualification = new List<QualificationOption>(); // Remove this from the url
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

        [HttpGet("results/filter/vacancy")]
        [ActionName("Vacancy")]
        public IActionResult Vacancy(ResultsFilter model)
        {
            return View(model);
        }

        [HttpPost("results/filter/vacancy")]
        [ActionName("Vacancy")]
        public IActionResult VacancyPost(bool hasvacancies, ResultsFilter filter)
        {
            filter.hasvacancies = hasvacancies;
            filter.page = null;
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        [HttpGet("results/filter/provider")]
        [ActionName("Provider")]
        public IActionResult Provider(ResultsFilter filter)
        {
            List<Provider> suggestions = TempData.Get<List<Provider>>("Suggestions");
            if (suggestions == null)
            {
                suggestions = _api.GetProviderSuggestions(filter.query);
            }
            ViewBag.suggestions = suggestions;
            return View("Provider", filter);
        }

        private async Task<GeocodingResult> ResolveAddressAsync(string lq)
        {
            GeocodingResult coords = null;
            try
            {
                coords = await _geocoder.ResolveAddressAsync(lq);

            }
            catch (Exception ex)
            {
                _telemetryClient.TrackException(ex);
            }

            return coords;
        }
    }
}
