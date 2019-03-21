using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Joins;

namespace SearchAndCompareUI.Tests.Unit.Tests.ViewFormatters
{
    static class CourseBuilder
    {
        public static Course BuildCourse(string name)
        {
            return new Course
            {
                Name = name,
                CourseSubjects = new List<CourseSubject>(),
                Route = new Route(),
            };

        }

        public static Course AddSubject(this Course course)
        {
            course.CourseSubjects.Add(new CourseSubject {Subject = new Subject()});
            return course;
        }

        public static Course AddBursarySubject(this Course course)
        {
            course.CourseSubjects.Add(new CourseSubject {Subject = new Subject {Funding = new SubjectFunding {BursaryFirst = 777}}});
            return course;
        }

        public static Course AddBursaryAndScholarshipSubject(this Course course)
        {
            course.CourseSubjects.Add(new CourseSubject {Subject = new Subject {Funding = new SubjectFunding {BursaryFirst = 123, Scholarship = 666}}});
            return course;
        }

        public static Course AddSalary(this Course course)
        {
            course.Route.IsSalaried = true;
            return course;
        }
    }
}