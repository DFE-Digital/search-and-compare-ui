using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.DatabaseAccess;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI;
using Microsoft.EntityFrameworkCore;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using System.Collections.Generic;

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
        public IActionResult Index(int courseId, ResultsFilter filter)
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
