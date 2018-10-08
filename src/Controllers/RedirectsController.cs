using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;

using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class RedirectsController : Controller
    {

        [HttpGet("/start/location")]
        public IActionResult StartLocation()
        {
            return RedirectToAction("LocationWizard", "Filter");
        }
    }
}