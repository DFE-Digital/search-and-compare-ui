using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using GovUk.Education.SearchAndCompare.ViewFormatters;

namespace GovUk.Education.SearchAndCompare.Domain.Models
{
    public static class CourseExtensionMethods
    {
        public static IEnumerable<CourseGroup> GroupCoursesByLocation(this IEnumerable<Course> courses)
        {
            // find all the locations regardless of whether it was a campus or location

            return courses
                .SelectMany(c => c.Campuses)
                .Where(c => c.Location?.Latitude != null && c.Location?.Longitude != null)
                .GroupBy(
                    campus => campus.Location.AsCoordinates(),
                    campus => campus.Course,
                    (key, groupedCourses) => new CourseGroup
                    {
                        Coordinates = key,
                        Courses = groupedCourses.ToList(),
                    }
                );
        }
    }
}
