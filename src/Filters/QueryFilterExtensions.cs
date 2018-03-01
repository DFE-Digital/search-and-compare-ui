using System;
using GovUk.Education.SearchAndCompare.Domain.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Filters
{
    public static class QueryFilterExtensions
    {
        public static object ToRouteValues(
            this QueryFilter queryFilter)
        {
            return new {
                queryFilter.page,
                queryFilter.lat,
                queryFilter.lng,
                queryFilter.rad,
                queryFilter.loc,
                queryFilter.lq,
                queryFilter.subjects,
                queryFilter.sortby,
                queryFilter.funding
            };
        }

        public static object ToRouteValuesWithError(
            this QueryFilter queryFilter,
            string error)
        {
            return new {
                error,
                queryFilter.page,
                queryFilter.lat,
                queryFilter.lng,
                queryFilter.rad,
                queryFilter.loc,
                queryFilter.lq,
                queryFilter.subjects,
                queryFilter.sortby,
                queryFilter.funding
            };
        }

        public static QueryFilter WithSortBy(
            this QueryFilter queryFilter, int? sortby)
        {
            return new QueryFilter
            {
                page = queryFilter.page,
                lat = queryFilter.lat,
                lng = queryFilter.lng,
                rad = queryFilter.rad,
                loc = queryFilter.loc,
                lq = queryFilter.lq,
                subjects = queryFilter.subjects,
                sortby = sortby,
                funding = queryFilter.funding
            };
        }

        public static QueryFilter WithPage(
            this QueryFilter queryFilter, int? page)
        {
            return new QueryFilter
            {
                page = page,
                lat = queryFilter.lat,
                lng = queryFilter.lng,
                rad = queryFilter.rad,
                loc = queryFilter.loc,
                lq = queryFilter.lq,
                subjects = queryFilter.subjects,
                sortby = queryFilter.sortby,
                funding = queryFilter.funding
            };
        }

        public static QueryFilter WithoutSubjects(
            this QueryFilter queryFilter)
        {
            return new QueryFilter
            {
                page = queryFilter.page,
                lat = queryFilter.lat,
                lng = queryFilter.lng,
                rad = queryFilter.rad,
                loc = queryFilter.loc,
                lq = queryFilter.lq,
                subjects = null,
                sortby = queryFilter.sortby,
                funding = queryFilter.funding
            };
        }
    }
}