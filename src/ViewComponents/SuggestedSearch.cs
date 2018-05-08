using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.ViewFormatters;
using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewComponents
{
    public class SuggestedSearch :ViewComponent
    {
        private readonly ISearchAndCompareApi _api;
        public SuggestedSearch(ISearchAndCompareApi api)
        {
            _api = api;
        }
        public async Task<IViewComponentResult> InvokeAsync(ResultsViewModel original)
        {
            var queryFilter = original.FilterModel.ToQueryFilter();


            var result = _api.GetCoursesTotalCount(queryFilter);


            return View(result);
        }
    }
}
