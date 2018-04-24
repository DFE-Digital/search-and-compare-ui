using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Filters;

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

        [HttpGet("course/ucas-redirect/{courseId:int}", Name = "RedirectToUcasCourse")]
        public RedirectResult RedirectToUcasCourse(int courseId, ResultsFilter filter)
        {
            return new RedirectResult("http://search.gttr.ac.uk/cgi-bin/hsrun.hse/General/2018_gttr_search/gttr_search.hjx;start=gttr_search.HsForm.run");
        }
    }
}
