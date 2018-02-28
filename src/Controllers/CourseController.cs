using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class CourseController : CommonAttributesControllerBase
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
            var fees = _api.GetLatestFees();

            var viewModel = new CourseViewModel()
            {
                Course = course,
                FilterModel = filter,
                Fees = FeesViewModel.FromCourseInfo(course.Subjects, course.Route, fees)
            };

            return View(viewModel);
        }
    }
}
