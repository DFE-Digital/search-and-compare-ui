
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Models;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.ExtensionMethods
{
    [TestFixture]
    public class CourseExtensionTests
    {
        [Test]
        public void GroupsColocatedCourses()
        {
            // arrange
            const double latitude = 12.34;
            const double longitude = 56.78;
            var course1 = BuildCourse(latitude, longitude, "defence against the dark arts");
            var course2 = BuildCourse(latitude, longitude, "potions and poisons");
            var courses = new List<Course>
            {
                course1,
                course2,
            };

            // act
            var courseGroups = courses.GroupCoursesByCampusLocation().ToList();

            // assert
            courseGroups.Should().NotBeNull();
            courseGroups.Should().HaveCount(1);
            var courseGroup = courseGroups.Single();
            courseGroup.Coordinates.Should().NotBeNull();
            courseGroup.Coordinates.Latitude.Should().Be(latitude);
            courseGroup.Coordinates.Longitude.Should().Be(longitude);
            courseGroup.Courses.Should().NotBeNull();
            courseGroup.Courses.Should().HaveCount(2);
        }

        [Test]
        public void DoesntGroupDistantCourses()
        {
            // arrange
            var course1 = BuildCourse(12.34, 56.78, "defence against the dark arts");
            var course2 = BuildCourse(-12.34, -56.78, "potions and poisons");
            var courses = new List<Course>
            {
                course1,
                course2,
            };

            // act
            var courseGroups = courses.GroupCoursesByCampusLocation().ToList();

            // assert
            courseGroups.Should().NotBeNull();
            courseGroups.Should().HaveCount(2);
            foreach (var courseGroup in courseGroups)
            {
                courseGroup.Coordinates.Should().NotBeNull();
                courseGroup.Coordinates.Latitude.Should().NotBe(default(double));
                courseGroup.Coordinates.Longitude.Should().NotBe(default(double));
                courseGroup.Courses.Should().NotBeNull();
                courseGroup.Courses.Should().HaveCount(1);
            }
        }

        private static Course BuildCourse(double latitude, double longitude, string courseName)
        {
            var campus = new Campus
            {
                Location = new Location
                {
                    Latitude = latitude,
                    Longitude = longitude,
                },
            };
            var course = new Course
            {
                Name = courseName,
                Campuses = new List<Campus>
                {
                    campus,
                },
            };
            campus.Course = course;
            return course;
        }
    }
}
