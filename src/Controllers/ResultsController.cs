using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class ResultsController : CommonAttributesControllerBase
    {
        private readonly ISearchAndCompareApi _api;

        public ResultsController(ISearchAndCompareApi api)
        {
            _api = api;
        }

        [HttpGet("results")]
        public IActionResult Index(QueryFilter filter)
        {
            var courses = _api.GetCourses(filter);

            var subjects = _api.GetSubjects();

            FilteredList<Subject> filteredSubjects;
            if (filter.SelectedSubjects.Count > 0) {
                filteredSubjects = new FilteredList<Subject>(
                    subjects.Where(subject => filter.SelectedSubjects.Contains(subject.Id)).ToList(),
                    subjects.Count
                );
            } else {
                filteredSubjects = new FilteredList<Subject>(subjects, subjects.Count);
            }

            var viewModel = new ResultsViewModel {
                Courses = courses,
                Subjects = filteredSubjects,
                FilterModel = filter
            };

            return View(viewModel);
        }

        [HttpGet("results/qualifications")]
        public IActionResult Qualifications(QueryFilter model)
        {         
            return View(model);
        }
        
        [HttpPost("results/sortby")]
        public IActionResult SortBy(QueryFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

    }
}
