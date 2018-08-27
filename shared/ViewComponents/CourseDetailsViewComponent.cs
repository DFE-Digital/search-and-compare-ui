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

        public IViewComponentResult Invoke(string providerCode, string courseCode, bool preview = false, string aboutYourOrgLink = null)
        {
            var course = _api.GetCourse(providerCode, courseCode);
            var feeCaps = _api.GetFeeCaps();

            var latestFeeCaps = feeCaps.OrderByDescending(x => x.EndYear).FirstOrDefault();

            var viewModel = new CourseDetailsViewModel()
            {
                Course = course,
                Finance = new FinanceViewModel(course, latestFeeCaps),
                PreviewMode = preview,
                AboutYourOrgLink = aboutYourOrgLink
            };

            return View(viewModel);
        }
    }

    public static class CourseDetailsSections
    {
        public const string AboutTheCourse = "about this training programme";
        public const string InterviewProcess = "interview process";
        public const string EntryRequirementsQualifications = "entry requirements";
        public const string EntryRequirementsPersonalQualities = "entry requirements personal qualities";
        public const string EntryRequirementsOther = "entry requirements other";
        public const string ListOfSchools = "placement schools";
        public const string AboutSchools = "about school placements";
        public const string AboutFees = "about fees";
        public const string AboutTheProvider = "about this training provider";
        public const string AboutTheAccreditingProvider = "about this training provider accrediting";        
        public const string TrainWithDisabilities = "training with disabilities";        
    }
}
