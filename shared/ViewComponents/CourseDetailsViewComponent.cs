using System;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Shared.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace GovUk.Education.SearchAndCompare.UI.Shared.ViewComponents
{
    public class CourseDetailsViewComponent : ViewComponent
    {        
        private readonly ICourseDetailsService _api;

        public CourseDetailsViewComponent(ICourseDetailsService api)
        {
            _api = api;
        }

        public IViewComponentResult Invoke(string providerCode, string courseCode)
        {
            var course = _api.GetCourse(providerCode, courseCode);
            var feeCaps = _api.GetFeeCaps();

            var latestFeeCaps = feeCaps.OrderByDescending(x => x.EndYear).FirstOrDefault();

            var viewModel = new CourseDetailsViewModel()
            {
                Course = course,
                Finance = new FinanceViewModel(course, latestFeeCaps)
            };

            return View(viewModel);
        }
    }
}
