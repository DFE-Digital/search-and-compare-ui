using Microsoft.AspNetCore.Mvc;

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
