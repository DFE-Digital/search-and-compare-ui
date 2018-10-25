using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using GovUk.Education.SearchAndCompare.ViewFormatters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class CourseMapPin : IMapMarker
    {
        public Location Location { get; set; }
        public Course Course { get; set; }

        /// <summary>
        /// Populated if this is the location of the provider of the course
        /// </summary>
        public Provider Provider { get; set; }

        /// <summary>
        /// Populated if this is the location of a campus used by the course
        /// </summary>
        public Campus Campus { get; set; }

        public Coordinates Coordinates => Location.AsCoordinates();
    }
}
