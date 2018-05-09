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

        private SuggestedSearchViewModel GetAvailableNextNearest(IList<int> availableRads, ResultsFilter resultsFilter, int currentTotal)
        {
            SuggestedSearchViewModel nextNearest = null;

            foreach (int availableRad in availableRads)
            {
                if (nextNearest == null) {
                    resultsFilter.rad = availableRad;
                    var result = _api.GetCoursesTotalCount(resultsFilter.ToQueryFilter());

                    if (result.TotalCount > currentTotal)
                    {
                        nextNearest = new SuggestedSearchViewModel { ResultsFilter = resultsFilter, TotalCount = result.TotalCount };
                    }
                }
            }

            return nextNearest;
        }

        public Task<IViewComponentResult> InvokeAsync(ResultsViewModel original)
        {
            var hasRadiusOption = original.FilterModel.RadiusOption.HasValue;
            var hasLocationOptionYes = (original.FilterModel.LocationOption == LocationOption.Yes);
            var hasSelectedFundingSalary = !(original.FilterModel.SelectedFunding == null || original.FilterModel.SelectedFunding == FundingOption.All) && original.FilterModel.SelectedFunding.Value.HasFlag(FundingOption.Salary);


            var allRads = Enum.GetValues(typeof(RadiusOption)).Cast<RadiusOption>();
            var radsMax = allRads.Max();

            var currentTotal = original.Courses.TotalCount;

            var results = new List<SuggestedSearchViewModel>();

            if (original.FilterModel.RadiusOption.HasValue && !original.FilterModel.RadiusOption.Value.Equals(allRads.Max()))
            {
                var availableRads = allRads.Where(x => x != radsMax && x > original.FilterModel.RadiusOption.Value)
                    .Select(x => (int)x )
                    .OrderBy(x => x)
                    .ToList();

                var nextNearest = this.GetAvailableNextNearest(availableRads, original.FilterModel.Clone(true), currentTotal);

                if (nextNearest != null)
                {
                    results.Add(nextNearest);
                }
            }

            if (hasLocationOptionYes && hasSelectedFundingSalary) {

                var newFilterModel = original.FilterModel.Clone(false);
                newFilterModel.LocationOption = LocationOption.No;
                var result = _api.GetCoursesTotalCount(newFilterModel.ToQueryFilter());

                // if(result.TotalCount > currentTotal)
                // {

                    results.Add(new SuggestedSearchViewModel { ResultsFilter = newFilterModel, TotalCount = result.TotalCount });
                // }


            }

            return Task.FromResult<IViewComponentResult>(View(results));
        }
    }
}
