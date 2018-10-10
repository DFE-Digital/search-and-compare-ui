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

        public Task<IViewComponentResult> InvokeAsync(ResultsViewModel originalViewModel, int maxResult)
        {
            var model = BuildViewModel(originalViewModel, maxResult);
            return Task.FromResult<IViewComponentResult>(View(model));
        }

        private SuggestedSearchesViewModel BuildViewModel(ResultsViewModel originalViewModel, int maxResult){
            var originalTotal = originalViewModel.Courses?.TotalCount ?? 0;

            // build default list
            var filters = new List<ResultsFilter>();
            var radiusFilters = GetAllLargerRadiusFilters(originalViewModel);
            filters.AddRange(radiusFilters);
            var allLocationsAndFunding = StripLocationAndFunding(originalViewModel);
            filters.Add(allLocationsAndFunding);

            // replace last item with salary

            var hasSalary = originalViewModel.FilterModel.SelectedFunding.HasValue && originalViewModel.FilterModel.SelectedFunding.Value != FundingOption.All && originalViewModel.FilterModel.SelectedFunding.Value.HasFlag(FundingOption.Salary);
            var salaryResults = new List<SuggestedSearchViewModel>();
            if (hasSalary) {
                var anyFundingFilter = new List<ResultsFilter> { RemoveFundingFilter(originalViewModel) };
                salaryResults = GetViewModelsWithCounts(anyFundingFilter, originalTotal, anyFundingFilter.Count());
            }
            var result = new SuggestedSearchesViewModel { OriginalResults = originalViewModel, HasSalary = hasSalary };
            var numberOfSearchesToBuild = maxResult;
            // always make the last entry the all-funding one if salary was set
            if (salaryResults.Any()) {
                // I think this is a bug, because it always adds one salary result, but it makes room for the total salary results, unless there is always only one in which case it works but is fragile
                // put usual suggestions first, but make room for salary suggestions within max
                result.SuggestedSearches = GetViewModelsWithCounts(filters, originalTotal, maxResult - salaryResults.Count() );
                result.SuggestedSearches.Add(salaryResults.First());
            } else {
                result.SuggestedSearches = GetViewModelsWithCounts(filters, originalTotal, maxResult);
            }
            result.SuggestedSearches = GetViewModelsWithCounts(filters, originalTotal, numberOfSearchesToBuild);
            return result;
        }

        private ResultsFilter RemoveFundingFilter(ResultsViewModel original)
        {
            var results = original.FilterModel.Clone(false, true);
                results.SelectedFunding = FundingOption.AnyFunding;
                results.LocationOption = LocationOption.No;

            return results;
        }

        private static IList<ResultsFilter> GetAllLargerRadiusFilters(ResultsViewModel original)
        {
            var allRads = Enum.GetValues(typeof(RadiusOption)).Cast<RadiusOption>();
            var radsMax = allRads.Max();
            if (original.FilterModel.RadiusOption == null || original.FilterModel.RadiusOption.Value.Equals(radsMax))
            {
                return new List<ResultsFilter>();
            }
            return allRads.Where(x => x != radsMax && x > original.FilterModel.RadiusOption.Value)
                .Select(x => (int)x)
                .OrderBy(x => x)
                .Select(x =>
                {
                    var cloneResultsFilter = original.FilterModel.Clone(true, true);
                    cloneResultsFilter.SelectedFunding = FundingOption.All;
                    cloneResultsFilter.rad = x;

                    return cloneResultsFilter;
                })
                .ToList();
        }

        private static ResultsFilter StripLocationAndFunding(ResultsViewModel original)
        {
            var filter = original.FilterModel.Clone(false);
            filter.SelectedFunding = FundingOption.All;
            filter.LocationOption = LocationOption.No;
            return filter;
        }

        /// <summary>
        /// Build list of search view models from supplied filter suggestions.
        /// As each one is added the course count is retrieved from the api and stored alongside the filter.
        /// If the course count is zero the filter is skipped.
        /// If the course count is the same as a suggestion that's already been processed then it is skipped.
        /// The process stops when either max is reached or all filters have been processed.
        /// </summary>
        private List<SuggestedSearchViewModel> GetViewModelsWithCounts(IList<ResultsFilter> filters, int originalTotal, int max)
        {
            var models = new List<SuggestedSearchViewModel>();
            foreach (var filter in filters)
            {
                if (models.Count() == max)
                {
                    break;
                }
                var countResult = _api.GetCoursesTotalCount(filter.ToQueryFilter());
                int courseCount = countResult.TotalCount;
                // Only add if the count is bigger than the search result we are trying to improve on and
                // it's not exactly the same number of results as another suggested search already in the list.
                if (courseCount > originalTotal && !models.Any(x => x.TotalCount == courseCount))
                {
                    models.Add(new SuggestedSearchViewModel { ResultsFilter = filter, TotalCount = courseCount });
                }
            }
            return models;
        }
    }
}
