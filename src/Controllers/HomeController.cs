using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class HomeController : CommonAttributesControllerBase
    {
        [HttpGet("")]
        public IActionResult Index()
        {
            return RedirectToAction("LocationWizard", "Filter");
        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return StatusCode(500);
        }
    }
}
