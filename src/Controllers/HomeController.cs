using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.ViewModels;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class HomeController : Controller
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
