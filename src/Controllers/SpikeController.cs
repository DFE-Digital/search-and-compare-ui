using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class SpikeController : AnalyticsControllerBase
    {
        private readonly ISearchAndCompareApi _api;

        public SpikeController(ISearchAndCompareApi api, AnalyticsPolicy analyticsPolicy) : base(analyticsPolicy)
        {
            _api = api;
        }

        [HttpGet("spike")]
        public IActionResult Index()
        {
            var course = _api.GetCourse(5251);
            var emptyPlaceholder = "Contact the training provider for this information";

            var entryRequirements = course.DescriptionSections.First(x => x.Name == "entry requirements").Text;
            var whatWeAreLookingFor = course.DescriptionSections.First(x => x.Name == "what we are looking for").Text;
            var aboutThisTrainingProvider = course.DescriptionSections.First(x => x.Name == "about this training provider").Text;


            course.DescriptionSections.First(x => x.Name == "entry requirements").Text =
                string.Join("\n\n",
                    "== Qualifications ==",
                    GetSubSection(entryRequirements, "Course Entry Requirements"),

                    "== Personal qualities ==",
                    GetSubSection(whatWeAreLookingFor, "What we are looking for"),

                    "== Other requirements ==",
                    emptyPlaceholder
                );

            course.DescriptionSections.First(x => x.Name == "about this training provider").Text =
                string.Join("\n\n",
                    emptyPlaceholder,

                    "== Access for disabled people ==",
                    GetSubSection(aboutThisTrainingProvider, "Disability Access"),

                    "== Interview process ==",
                    GetConcatSection(course, "how we select our trainees"),

                    "== After you've qualified ==",
                    GetSubSection(aboutThisTrainingProvider, "Expectation of Employment")

                );

            course.DescriptionSections.First(x => x.Name == "about this training programme").Text =
                GetConcatSection(course, "about this training programme");


            return View(new CourseViewModel
            {
                Course = course,
                Finance = new FinanceViewModel 
                {
                    Course = course,
                    FeeCaps = _api.GetFeeCaps().Single()
                },
                FilterModel = new QueryFilter()
            });
        }

        private string GetSubSection(string full, string subSectionName)
        {
            return new Regex(string.Format(@"==\s*{0}\s*==\s*((?:(?!==|$).)+)", subSectionName), RegexOptions.Singleline)
                .Match(full)
                .Groups[1].Value;
        }

        private string GetConcatSection(Course course, string sectionName)
        {
            var full = course.DescriptionSections.First(x => x.Name == sectionName).Text;
            
            return new Regex(@"^==\s*((?:(?!\s*==).)+)\s*==", RegexOptions.Multiline)
                .Replace(full, x => x.Groups[1].Value);
        }
    }
}