using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Services.Maps.Models
{
    public class CourseGroup : IMapMarker
    {
        public Coordinates Coordinates { get; set; }

        public IEnumerable<Course> Courses { get; set; }
    }
}
