using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class RedirectsController : CommonAttributesControllerBase
    {

        [HttpGet("/start/location")]
        public IActionResult StartLocation()
        {
            return RedirectToAction("LocationWizard", "Filter");
        }
    }
}