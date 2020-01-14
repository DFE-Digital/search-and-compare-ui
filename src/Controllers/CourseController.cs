using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    public class CourseController : Controller
    {
        private readonly ISearchAndCompareApi _api;
        private readonly IRedirectUrlService redirectUrlService;
        private readonly IFeatureFlags featureFlags;

        public CourseController(ISearchAndCompareApi api, IRedirectUrlService redirectUrlService, IFeatureFlags featureFlags)
        {
            _api = api;
            this.redirectUrlService = redirectUrlService;
            this.featureFlags = featureFlags;
        }

        [HttpGet("course/{providerCode}/{courseCode}", Name = "Course")]
        public IActionResult Index(string providerCode, string courseCode, ResultsFilter filter)
        {
            if (featureFlags.RedirectToRails)
            {
                return redirectUrlService.RedirectToNewApp("/course/" + $"{providerCode}" + "/" + $"{courseCode}");
            }

            var course = _api.GetCourse(providerCode, courseCode);
            var feeCaps = _api.GetFeeCaps();

            var latestFeeCaps = feeCaps.OrderByDescending(x => x.EndYear).FirstOrDefault();

            if (course == null || latestFeeCaps == null)
            {
                return NotFound();
            }

            var viewModel = new CourseDetailsViewModel()
            {
                Course = course,
                Finance = new Shared.ViewModels.FinanceViewModel(course, latestFeeCaps),
                PreviewMode = false
            };

            return View(viewModel);
        }
    }
}
