using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public partial class ResultsController
    {
        public class CourseMapPin
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
        }
    }
}
