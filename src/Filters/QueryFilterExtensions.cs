using System;
using System.Collections.Generic;
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
                queryFilter.funding,
                queryFilter.query,
                queryFilter.display,
                queryFilter.zoomlevel,
                queryFilter.offlng,
                queryFilter.offlat,
                queryFilter.fulltime,
                queryFilter.parttime,
                queryFilter.pgce,
                queryFilter.qts
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
                queryFilter.funding,
                queryFilter.query,
                queryFilter.display,
                queryFilter.zoomlevel,
                queryFilter.offlng,
                queryFilter.offlat,
                queryFilter.fulltime,
                queryFilter.parttime,
                queryFilter.pgce,
                queryFilter.qts
            };
        }

        public static QueryFilter WithoutLocation(this QueryFilter queryFilter)
        {
            return new QueryFilter
            {
                //page = queryFilter.page,
                subjects = queryFilter.subjects,
                funding = queryFilter.funding,
                query = queryFilter.query,
                fulltime = queryFilter.fulltime,
                parttime = queryFilter.parttime,
                pgce = queryFilter.pgce,
                qts = queryFilter.qts
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
                funding = queryFilter.funding,
                query = queryFilter.query,
                display = queryFilter.display,
                zoomlevel = queryFilter.zoomlevel,
                offlng = queryFilter.offlng,
                offlat = queryFilter.offlat,
                fulltime = queryFilter.fulltime,
                parttime = queryFilter.parttime,
                pgce = queryFilter.pgce,
                qts = queryFilter.qts
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
                funding = queryFilter.funding,
                query = queryFilter.query,
                display = queryFilter.display,
                zoomlevel = queryFilter.zoomlevel,
                offlng = queryFilter.offlng,
                offlat = queryFilter.offlat,
                fulltime = queryFilter.fulltime,
                parttime = queryFilter.parttime,
                pgce = queryFilter.pgce,
                qts = queryFilter.qts
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
                funding = queryFilter.funding,
                query = queryFilter.query,
                display = queryFilter.display,
                zoomlevel = queryFilter.zoomlevel,
                offlng = queryFilter.offlng,
                offlat = queryFilter.offlat,
                fulltime = queryFilter.fulltime,
                parttime = queryFilter.parttime,
                pgce = queryFilter.pgce,
                qts = queryFilter.qts
            };
        }

        public static bool LocationFilterActive(this QueryFilter queryFilter)
        {
            return queryFilter.RadiusOption != null;
        }

        public static IEnumerable<string> GetQualificationStrings(this QueryFilter queryFilter)
        {
            if (!queryFilter.qts || queryFilter.pgce) 
            {
                yield return "Postgraduate Certificate in Education with Qualified Teacher Status";
            }            
            if (!queryFilter.pgce || queryFilter.qts)
            {
                yield return "Qualified Teacher Status";
            }
        }

        public static IEnumerable<string> GetStudyTypeStrings(this QueryFilter queryFilter)
        {
            if (!queryFilter.parttime || queryFilter.fulltime) 
            {
                yield return "Full time (12 months)";
            }            
            if (!queryFilter.fulltime || queryFilter.parttime)
            {
                yield return "Part time (18 - 24 months)";
            }
        }
        
    }
}