using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Services;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.SearchAndCompare.ViewModels
{
    public class MapViewModel
    {
        public IEnumerable<CourseGroup> CourseGroups { get; set; }

        public IHtmlArea MyLocationArea { get; set; }

        public Coordinates MyLocation { get; set; }

        public IMapProjection<IMapMarker> Map { get; set; }

        public string MapsApiKey { get; set; }
    }
}