using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Models;
using NUnit.Framework;
using Moq;
using MockQueryable.Moq;
using GovUk.Education.SearchAndCompare.UI.Models.Joins;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests
{
    [TestFixture]
    public class FilterListTests
    {
        [Test]
        public async Task CreateAsync_Subject_Filtered()
        {
            var testFilterIds = new List<int> { 1, 2 };

            var testSubjects = new List<Subject> {
                new Subject { Id = 0 },
                new Subject { Id = 1 },
                new Subject { Id = 2 },
                new Subject { Id = 3 }
            };

            var testSubjectsMock = testSubjects.AsQueryable().BuildMock();

            var filtered = await FilterList<Subject>.CreateAsync(testSubjectsMock.Object, testFilterIds);

            Assert.That(filtered.Count == 2);
            Assert.That(filtered.TotalCount == 2);
            Assert.That(filtered.Contains(testSubjects[1]));
            Assert.That(filtered.Contains(testSubjects[2]));
        }

        [Test]
        public async Task CreateAsync_Course_Filtered()
        {
            var testFilterIds = new List<int> { 2, 3 };

            var testCourseSubjects1 = new List<CourseSubject> {
                new CourseSubject { Subject = new Subject { Id = 0 }},
                new CourseSubject { Subject = new Subject { Id = 1 }},
            };
            var testCourseSubjects2 = new List<CourseSubject> {
                new CourseSubject { Subject = new Subject { Id = 2 }},
                new CourseSubject { Subject = new Subject { Id = 3 }},
            };
            var testCourses = new List<Course> {
                new Course { CourseSubjects = testCourseSubjects1 },
                new Course { CourseSubjects = testCourseSubjects2 },
                new Course { CourseSubjects = testCourseSubjects2 }
            };

            var testCoursesMock = testCourses.AsQueryable().BuildMock();

            var filtered = await FilterList<Course>.CreateAsync(testCoursesMock.Object, testFilterIds);

            Assert.That(filtered.Count == 2);
            Assert.That(filtered.TotalCount == 2);
            Assert.That(filtered.Contains(testCourses[1]));
            Assert.That(filtered.Contains(testCourses[2]));
        }
    }
}
