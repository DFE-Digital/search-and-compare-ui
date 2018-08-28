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
        [HttpGet("course/{providerCode}/{courseCode}", Name = "Course")]
        public IActionResult Index(string providerCode, string courseCode, ResultsFilter filter)
        {
            return View(new CourseViewModel {
                CourseCode = courseCode,
                ProviderCode = providerCode
            });
        }
    }
}
