using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    public class CourseController : Controller
    {
        private readonly ISearchAndCompareApi _api;
        private readonly IRedirectUrlService redirectUrlService;

        public CourseController(ISearchAndCompareApi api, IRedirectUrlService redirectUrlService)
        {
            _api = api;
            this.redirectUrlService = redirectUrlService;
        }

        [HttpGet("course/{providerCode}/{courseCode}", Name = "Course")]
        public IActionResult Index(string providerCode, string courseCode, ResultsFilter filter)
        {
            return redirectUrlService.RedirectToNewApp("/course/" + $"{providerCode}" + "/" + $"{courseCode}");
        }
    }
}
