using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class ResultsController : AnalyticsControllerBase
    {
        private int pageSize = 10;

        private readonly ISearchAndCompareApi _api;

        public ResultsController(ISearchAndCompareApi api, AnalyticsPolicy analyticsPolicy) : base(analyticsPolicy)
        {
            _api = api;
        }

        [HttpGet("results")]
        public IActionResult Index(QueryFilter filter)
        {
            var courses = _api.GetCourses(filter);

            var subjects = _api.GetSubjects(filter);

            var viewModel = new ResultsViewModel {
                Courses = courses,
                Subjects = subjects,
                FilterModel = filter
            };

            return View(viewModel);
        }

        [HttpGet("results/qualifications")]
        public IActionResult Qualifications(QueryFilter model)
        {
            ViewData["Filter"] = model;
                        
            return View();
        }
    }
}
