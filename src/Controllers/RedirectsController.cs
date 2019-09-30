using Microsoft.AspNetCore.Mvc;

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