using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;

namespace GovUk.Education.SearchAndCompare.ViewModels
{
    public class MapViewModel
    {
        public IEnumerable<CourseGroup> CourseGroups { get; set; }

        public Coordinates MyLocation { get; set; }

        public IMapProjection<IMapMarker> Map { get; set; }
    }
}
