using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ActionFilters
{
    public class AnalyticsAttribute : ActionFilterAttribute
    {
        private readonly AnalyticsPolicy policy;

        public AnalyticsAttribute(AnalyticsPolicy policy)
        {
            this.policy = policy;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (policy == AnalyticsPolicy.Yes)
            {
                ((Controller) context.Controller).ViewData["SEND_ANALYTICS"] = true;
            }

            base.OnActionExecuting(context);
        }
    }
}
