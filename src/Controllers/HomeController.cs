using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class HomeController : CommonAttributesControllerBase
    {
        public IActionResult Error()
        {
            return StatusCode(500);
        }
    }
}
