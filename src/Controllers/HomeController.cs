using System.Diagnostics;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class HomeController : CommonAttributesControllerBase
    {
        private bool PreLaunchMode;

        public HomeController(IConfiguration Configuration)
        {
            PreLaunchMode = !string.IsNullOrWhiteSpace(Configuration["SITE_PASSWORD"]);
        }

        [HttpGet("")]
        [HttpGet("home")]
        [HttpGet("home/index")]
        public IActionResult Index()
        {
            if (PreLaunchMode) {
                return View("Index");
            } else {
                bool hideBack = true;
                return RedirectToAction("LocationWizard", "Filter", new { hideBack });
            }
        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return StatusCode(500);
        }
    }
}
