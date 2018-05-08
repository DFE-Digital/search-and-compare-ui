using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Data;
using GovUk.Education.SearchAndCompare.ViewFormatters;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewComponents
{
    public class SuggestedSearch :ViewComponent
    {
        private readonly ISearchAndCompareApi _api;
        public SuggestedSearch(ISearchAndCompareApi api)
        {
            _api = api;
        }

        private KeyValuePair<QueryFilter, TotalCountResult>? GetAvailableNextNearest(IList<int> availableRads, QueryFilter queryFilter, int currentTotal)
        {
            KeyValuePair<QueryFilter, TotalCountResult>? nextNearest = null;

            foreach (int availableRad in availableRads)
            {
                if (nextNearest == null) {
                    queryFilter.rad = availableRad;
                    var result = _api.GetCoursesTotalCount(queryFilter);

                    if (result.TotalCount > currentTotal)
                    {
                        nextNearest = new KeyValuePair<QueryFilter, TotalCountResult>(queryFilter, result);
                    }
                }
            }

            return nextNearest;
        }

        public async Task<IViewComponentResult> InvokeAsync(ResultsViewModel original)
        {
            var hasRadiusOption = original.FilterModel.RadiusOption.HasValue;
            var hasLocationOptionNo = (original.FilterModel.LocationOption == LocationOption.No);

            var allRads = Enum.GetValues(typeof(RadiusOption)).Cast<RadiusOption>();
            var radsMax = allRads.Max();

            var currentTotal = original.Courses.TotalCount;

            var results = new Dictionary<QueryFilter, TotalCountResult>();

            if (original.FilterModel.RadiusOption.HasValue && original.FilterModel.RadiusOption.Value.Equals(allRads.Max()))
            {
                var availableRads = allRads.Where(x => x != radsMax && x > original.FilterModel.RadiusOption.Value)
                    .Select(x => (int)x )
                    .OrderBy(x => x)
                    .ToList();

                var nextNearest = this.GetAvailableNextNearest(availableRads, original.FilterModel.ToQueryFilter(), currentTotal);

                if (nextNearest.HasValue)
                {
                    results.Add(nextNearest.Value.Key, nextNearest.Value.Value);
                }
            }

            // if (!hasLocationOptionNo) {

            //     queryFilter.rad = availableRad;
            //     var result = _api.GetCoursesTotalCount(queryFilter);

            // }

            return View(results);
        }
    }
}
