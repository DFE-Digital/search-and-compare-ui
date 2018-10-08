using Microsoft.AspNetCore.Mvc;

using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Error()
        {
            return StatusCode(500);
        }
    }
}
