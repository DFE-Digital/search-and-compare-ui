using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    [ServiceFilter(typeof(AnalyticsAttribute))]
    public abstract class CommonAttributesControllerBase : Controller
    {
    }
}