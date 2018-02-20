using System;
using GovUk.Education.SearchAndCompare.Domain.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Filters
{
    public static class QueryFilterExtensions
    {
        public static object ToRouteValues(
            this QueryFilter resultsFilter) {
            return new {
                resultsFilter.page,
                resultsFilter.lat,
                resultsFilter.lng,
                resultsFilter.rad,
                resultsFilter.loc,
                resultsFilter.subjects,
                resultsFilter.sortby
            };
        }

        public static QueryFilter WithSortBy(
            this QueryFilter resultsFilter, int? sortby)
        {
            return new QueryFilter
            {
                page = resultsFilter.page,
                lat = resultsFilter.lat,
                lng = resultsFilter.lng,
                rad = resultsFilter.rad,
                loc = resultsFilter.loc,
                subjects = resultsFilter.subjects,
                sortby = sortby
            };
        }

        public static QueryFilter WithPage(
            this QueryFilter resultsFilter, int? page)
        {
            return new QueryFilter
            {
                page = page,
                lat = resultsFilter.lat,
                lng = resultsFilter.lng,
                rad = resultsFilter.rad,
                loc = resultsFilter.loc,
                subjects = resultsFilter.subjects,
                sortby = resultsFilter.sortby
            };
        }
    }
}