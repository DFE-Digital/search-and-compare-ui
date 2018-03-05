using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Client;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{

    //[Authorize]
    public class DynamicController : CommonAttributesControllerBase
    {  
        private readonly ISearchAndCompareApi _api;

        public DynamicController(ISearchAndCompareApi api)
        {
            _api = api;
        }

        [HttpGet("/dynamic/providersuggest")]
        public JsonResult ProviderSuggest(string query)
        {
            var res = _api.GetProviderSuggestions(query);
            return Json(res
                .Select(x => x.Name)
                .ToList());
        }
    }
}
