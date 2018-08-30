using System;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace GovUk.Education.SearchAndCompare.UI.Shared.ViewComponents
{
    public class CourseDetailsViewComponent : ViewComponent
    {     
        public IViewComponentResult Invoke(CourseDetailsViewModel course)
        {
            return View(course);
        }
    }
}
