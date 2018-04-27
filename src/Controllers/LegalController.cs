using System.Diagnostics;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class LegalController : CommonAttributesControllerBase
    {
        [HttpGet("cookies")]
        public IActionResult Cookies()
        {
            return View();
        }
    }
}
