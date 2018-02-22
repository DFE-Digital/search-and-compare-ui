using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class CourseController : AnalyticsControllerBase
    {
        private readonly ISearchAndCompareApi _api;

        public CourseController(ISearchAndCompareApi api, AnalyticsPolicy analyticsPolicy) : base(analyticsPolicy)
        {
            _api = api;
        }

        [HttpGet("course/{courseId:int}", Name = "Course")]
        public IActionResult Index(int courseId, QueryFilter filter)
        {
            var course = _api.GetCourse(courseId);
            var feeCaps = _api.GetFeeCaps();

            var latestFeeCaps = feeCaps.OrderByDescending(x => x.EndYear).FirstOrDefault();

            var viewModel = new CourseViewModel()
            {
                Course = course,
                FilterModel = filter,
                Finance = new FinanceViewModel(course, latestFeeCaps)
            };

            return View(viewModel);
        }
    }
}
