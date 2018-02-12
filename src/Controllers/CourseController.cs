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
        private readonly ICourseDbContext _context;

        public CourseController(ICourseDbContext courseDbContext)
        {
            _context = courseDbContext;
        }

        [HttpGet("course/{courseId:int}", Name = "Course")]
        public async Task<IActionResult> Index(int courseId, ResultsFilterViewModel model)
        {
            var courses = _context.GetCoursesWithProviderSubjectsRouteCampusesAndDescriptions();
            var fees = _context.GetLatestFees();

            var course = await courses.Where(c => c.Id == courseId).FirstAsync();

            var viewModel = new CourseViewModel()
            {
                Course = course,
                FilterModel = model,
                Fees = FeesViewModel.FromCourseInfo(course.Subjects, course.Route, fees)
            };

            return View(viewModel);
        }
    }
}
