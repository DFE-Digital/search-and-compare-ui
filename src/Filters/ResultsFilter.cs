using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Web;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Filters.Enums;

namespace GovUk.Education.SearchAndCompare.UI.Filters
{
    public class ResultsFilter
    { 
        public int? page { get; set; }

        public double? lng { get; set; }

        public double? lat { get; set; }

        public int? rad { get; set; }

        public string loc { get; set; }

        public int? l { get; set; }

        public string lq { get; set; }

        public string subjects { get; set; }

        public int? sortby { get; set; }

        public int? funding { get; set; }

        public string query { get; set; }

        public string display { get; set; }

        public int? zoomlevel { get; set; }

        public double? offlng { get; set; }

        public double? offlat { get; set; }

        public List<int> SelectedSubjects { 
            get {            
                List<int> subjectFilterIds = new List<int> ();
                if (!string.IsNullOrEmpty(subjects))
                {
                    subjectFilterIds = subjects.Split(',')?.Select(int.Parse).ToList();
                }
                return subjectFilterIds;
            }

            set {
                subjects = string.Join(",", value);
            }
        }

        public FundingOption? SelectedFunding
        {
            get { return (FundingOption?)funding; }
            set { funding = (int?)value; }
        }
        
        public Coordinates Coordinates
        {
            get {
                return lng.HasValue && lat.HasValue && rad.HasValue 
                    ? new Coordinates(lat.Value, lng.Value, null, loc) 
                    : null;
            }
        }

        public Coordinates OffsetCoordinates
        {
            get {
                return offlat.HasValue && offlng.HasValue
                    ? new Coordinates(offlat.Value, offlng.Value) 
                    : null;
            }
        }

        public RadiusOption? RadiusOption
        {
            get {
                return rad.HasValue ? (RadiusOption?) rad.Value : null;
            }
        }

        public SortByOption? SortBy
        {
            get {
                return sortby.HasValue ? (SortByOption?) sortby.Value : null;
            }
        }

        public IEnumerable<SortByOption> ValidSortings
        {
            get {
                return Enum.GetValues(typeof(SortByOption)).Cast<SortByOption>()
                           .Where(x => x != SortByOption.Distance || LocationFilterActive);
            }
        }

        public bool LocationFilterActive
        {
            get { return LocationOption == LocationOption.Yes; }
        }

        public LocationOption LocationOption
        {
            get{ return this.l.HasValue ? (LocationOption)this.l : LocationOption.Unset; }
            set { this.l = (int)value; }
        }

        public bool DisplayAsMap
        {
            get
            {
                return display == DisplayOptions.Map;
            }
        }

        public DisplayOptions DisplayOptions = new DisplayOptions();

        public QueryFilter ToQueryFilter()
        {
            return new QueryFilter
            {
                page = this.page,
                lat = this.lat,
                lng = this.lng,
                rad = this.rad,
                subjects = this.subjects,
                sortby = this.sortby,
                funding = this.funding,
                query = this.query
            };
        }

        public object ToRouteValues()
        {
            return new
            {
                page,
                lat,
                lng,
                rad,
                loc,
                lq,
                l,
                subjects,
                sortby,
                funding,
                query,
                display,
                zoomlevel,
                offlng,
                offlat
            };
        }

        public object ToRouteValuesWithError(string error)
        {
            return new 
            {
                error,
                page,
                lat,
                lng,
                rad,
                loc,
                lq,
                l,
                subjects,
                sortby,
                funding,
                query,
                display,
                zoomlevel,
                offlng,
                offlat
            };
        }

        public ResultsFilter WithoutLocation()
        {
            return new ResultsFilter
            {
                page = this.page,
                l = this.l,
                subjects = this.subjects,
                sortby = sortby,
                funding = this.funding,
                query = this.query,
                display = this.display,
                zoomlevel = this.zoomlevel,
                offlng = this.offlng,
                offlat = this.offlat
            }; 
        }

        public ResultsFilter WithSortBy(int? sortby)
        {
            return new ResultsFilter
            {
                page = this.page,
                lat = this.lat,
                lng = this.lng,
                rad = this.rad,
                loc = this.loc,
                lq = this.lq,
                l = this.l,
                subjects = this.subjects,
                sortby = sortby,
                funding = this.funding,
                query = this.query,
                display = this.display,
                zoomlevel = this.zoomlevel,
                offlng = this.offlng,
                offlat = this.offlat
            };
        }

        public  ResultsFilter WithPage(int? page)
        {
            return new ResultsFilter
            {
                page = page,
                lat = this.lat,
                lng = this.lng,
                rad = this.rad,
                loc = this.loc,
                lq = this.lq,
                l = this.l,
                subjects = this.subjects,
                sortby = this.sortby,
                funding = this.funding,
                query = this.query,
                display = this.display,
                zoomlevel = this.zoomlevel,
                offlng = this.offlng,
                offlat = this.offlat
            };
        }

        public ResultsFilter WithoutSubjects()
        {
            return new ResultsFilter
            {
                page = this.page,
                lat = this.lat,
                lng = this.lng,
                rad = this.rad,
                loc = this.loc,
                lq = this.lq,
                l = this.l,
                subjects = null,
                sortby = this.sortby,
                funding = this.funding,
                query = this.query,
                display = this.display,
                zoomlevel = this.zoomlevel,
                offlng = this.offlng,
                offlat = this.offlat
            };
        }
    }
}