using System.Diagnostics;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class HomeController : CommonAttributesControllerBase
    {
        [HttpGet("")]
        [HttpGet("home")]
        [HttpGet("home/index")]
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public IActionResult Error()
        {
            return View(new ErrorViewModel {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
    }
}
