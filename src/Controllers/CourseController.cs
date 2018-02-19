using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class CourseController : Controller
    {
        private readonly ISearchAndCompareApi _api;

        public CourseController(ISearchAndCompareApi api)
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
