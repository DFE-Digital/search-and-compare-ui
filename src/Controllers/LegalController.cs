using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class LegalController : Controller
    {
        [HttpGet("cookies")]
        public IActionResult Cookies()
        {
            return View();
        }

        [HttpGet("privacy-policy")]
        public IActionResult Privacy()
        {
            return View();
        }

        [HttpGet("terms-conditions")]
        public IActionResult TandC()
        {
            return View();
        }

        [HttpGet("accessibility")]
        public IActionResult  Accessibility()
        {
            return View();
        }
    }
}
