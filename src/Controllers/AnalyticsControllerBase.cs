using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public abstract class AnalyticsControllerBase : Controller
    {
        private readonly AnalyticsPolicy policy;

        public AnalyticsControllerBase(AnalyticsPolicy policy)
        {
            this.policy = policy;
        }

        public override void OnActionExecuting(ActionExecutingContext context) 
        {
            if (policy == AnalyticsPolicy.Yes) 
            {
                ViewData["analytics"] = true;
            }

            base.OnActionExecuting(context);
        }
    }
}