using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Models;
using Microsoft.AspNetCore.Routing;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;
using System;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ResultsFilterViewModel
    {
        // model-bound properties        
        public int? page { get; set; }

        public double? lng { get; set; }

        public double? lat { get; set; }

        public int? rad { get; set; }

        public string loc { get; set; }

        public string subjects { get; set; }

        public int? sortby { get; set; }

        public object ToRouteValues() {
            return new {
                page,
                lat,
                lng,
                rad,
                loc,
                subjects,
                sortby
            };
        }

        public ResultsFilterViewModel WithSortBy(int? sortby)
        {
            return new ResultsFilterViewModel
            {
                page = page,
                lat = lat,
                lng = lng,
                rad = rad,
                loc = loc,
                subjects = subjects,
                sortby = sortby
            };
        }

        public ResultsFilterViewModel WithPage(int? page)
        {
            return new ResultsFilterViewModel
            {
                page = page,
                lat = lat,
                lng = lng,
                rad = rad,
                loc = loc,
                subjects = subjects,
                sortby = sortby
            };
        }

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
        
        public Coordinates Coordinates
        {
            get {
                return lng.HasValue && lat.HasValue && rad.HasValue 
                    ? new Coordinates(lat.Value, lng.Value, null, loc) 
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
                           .Where(x => x != SortByOption.Distance || RadiusOption != null);
            }
        }
    }
}