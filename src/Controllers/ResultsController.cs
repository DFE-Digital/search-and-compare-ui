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
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;
using System.Collections.Generic;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class ResultsController : Controller
    {
        private int pageSize = 10;
        private readonly ICourseDbContext _context;

        public ResultsController(ICourseDbContext courseDbContext)
        {
            _context = courseDbContext;
        }

        [HttpGet("results")]
        public IActionResult Index(ResultsFilterViewModel model)
        {
            var subjectFilterIds = model.SelectedSubjects;

            IQueryable<Course> courses;
            if (model.Coordinates != null && model.RadiusOption != null)
            {
                courses = _context.GetLocationFilteredCourses(
                    model.Coordinates.Latitude,
                    model.Coordinates.Longitude,
                    model.RadiusOption.Value.ToMetres());
            } 
            else
            {
                courses = _context.GetCoursesWithProviderSubjectsRouteAndCampuses(); 
            }

            var subjects = _context.GetSubjects();

            if (subjectFilterIds.Count() > 0)
            {
                courses = courses
                    .Where(course => course.CourseSubjects
                    .Any(courseSubject => subjectFilterIds
                        .Contains(courseSubject.Subject.Id)));
            }

            switch (model.SortBy)
            {
                case (SortByOption.ZtoA):
                {
                    courses = courses.OrderByDescending(c => c.Provider.Name);
                    break;
                }
                case (SortByOption.Distance):
                {
                    courses = courses.OrderBy(c => c.Distance);
                    break;
                }
                default:
                case (SortByOption.AtoZ):
                {
                    courses = courses.OrderBy(c => c.Provider.Name);
                    break;
                }
            }

            var viewModel = new ResultsViewModel {
                Courses = PaginatedList<Course>
                    .Create(courses.AsNoTracking(), model.page ?? 1, pageSize),
                Subjects = FilterList<Subject>
                    .Create(subjects.AsNoTracking(), subjectFilterIds),
                FilterModel = model
            };

            return View(viewModel);
        }

        [HttpGet("results/qualifications")]
        public IActionResult Qualifications(ResultsFilterViewModel model)
        {
            ViewData["Filter"] = model;
                        
            return View();
        }
    }
}
