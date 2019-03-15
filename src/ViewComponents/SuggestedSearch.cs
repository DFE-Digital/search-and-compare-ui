using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;
using Microsoft.Extensions.Logging;

namespace GovUk.Education.SearchAndCompare.UI.ViewComponents
{
    public class SuggestedSearch :ViewComponent
    {
        private readonly ISearchAndCompareApi _api;
        private readonly ILogger<SuggestedSearch> _logger;

        public SuggestedSearch(ISearchAndCompareApi api, ILogger<SuggestedSearch> logger)
        {
            _api = api;
            _logger = logger;
        }

        public Task<IViewComponentResult> InvokeAsync(ResultsViewModel original, int maxResult)
        {
            var originalTotal = original.Courses?.TotalCount ?? 0;

            var hasSalary =
                original.FilterModel.SelectedFunding.HasValue &&
                original.FilterModel.SelectedFunding.Value != FundingOption.All &&
                original.FilterModel.SelectedFunding.Value.HasFlag(FundingOption.Salary);

            var resultsFilters = GetSuggestedSearchesResultsFiltersForAllFunding(original);

            var salaryResults = new List<SuggestedSearchViewModel>();
            if (hasSalary) {
                var salaryResultsFilters = new List<ResultsFilter> { GetSuggestedSearchesResultsFilterForAnyFunding(original) };

                salaryResults = GetResults(salaryResultsFilters, originalTotal, salaryResultsFilters.Count());
            }

            var result = new SuggestedSearchesViewModel { OriginalResults = original, HasSalary = hasSalary };
            var salaryResult = salaryResults.FirstOrDefault();
            if (salaryResult != null) {
                result.SuggestedSearches = GetResults(resultsFilters, originalTotal, maxResult - salaryResults.Count() );
                result.SuggestedSearches.Add(salaryResult);
            }
            else {
                result.SuggestedSearches = GetResults(resultsFilters, originalTotal, maxResult);
            }


            return Task.FromResult<IViewComponentResult>(View(result));
        }

        private ResultsFilter GetSuggestedSearchesResultsFilterForAnyFunding(ResultsViewModel original)
        {
            var results = original.FilterModel.Clone(false, true);
                results.SelectedFunding = FundingOption.AnyFunding;
                results.LocationOption = LocationOption.No;

            return results;
        }

        private IList<ResultsFilter> GetSuggestedSearchesResultsFiltersForAllFunding(ResultsViewModel original)
        {
            var allRads = Enum.GetValues(typeof(RadiusOption)).Cast<RadiusOption>();
            var radsMax = allRads.Max();

            var resultsFilters = new List<ResultsFilter>();

            if (original.FilterModel.RadiusOption.HasValue && !original.FilterModel.RadiusOption.Value.Equals(allRads.Max()))
            {
                var availableRadSearches = allRads.Where(x => x != radsMax && x > original.FilterModel.RadiusOption.Value)
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

                resultsFilters.AddRange(availableRadSearches);
            }

            var noLocationResultsFilter = original.FilterModel.Clone(false);
            noLocationResultsFilter.SelectedFunding = FundingOption.All;
            noLocationResultsFilter.LocationOption = LocationOption.No;

            resultsFilters.Add(noLocationResultsFilter);

            return resultsFilters;
        }


        private List<SuggestedSearchViewModel> GetResults(IList<ResultsFilter> resultsFilters, int originalTotal, int maxResult)
        {
            var results = new List<SuggestedSearchViewModel>();

            try {
                foreach (var resultsFilter in resultsFilters)
                {
                    if (results.Count != maxResult)
                    {
                        var result = _api.GetCoursesTotalCount(resultsFilter.ToQueryFilter());
                        if (result.TotalCount > originalTotal && !results.Any(x => x.TotalCount == result.TotalCount))
                        {
                        results.Add(new SuggestedSearchViewModel { ResultsFilter = resultsFilter, TotalCount = result.TotalCount });
                        }
                    }
                }
            } catch (Exception e) {
                _logger.LogError("Suggested search failed, exception swallowed to avoid 500 error to user.", e);
            }

            return results.ToList();
        }
    }
}
