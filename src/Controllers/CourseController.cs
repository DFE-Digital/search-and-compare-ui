using System.Linq;
using GovUk.Education.SearchAndCompare.Client;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class CourseController : CommonAttributesControllerBase
    {
        private readonly ISearchAndCompareApi _api;

        public CourseController(ISearchAndCompareApi api)
        {
            _api = api;
        }

        [HttpGet("course/{courseId:int}", Name = "Course")]
        public IActionResult Index(int courseId, ResultsFilter filter)
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

        [HttpGet("course/{courseId:int}/ucas-redirect", Name = "RedirectToUcasCourse")]
        public RedirectResult RedirectToUcasCourse(int courseId)
        {
            var url = _api.GetUcasCourseUrl(courseId);

            return new RedirectResult(url);
        }
    }
}
