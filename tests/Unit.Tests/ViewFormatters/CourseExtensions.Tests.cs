using System.Collections.Generic;
using FluentAssertions;
using FluentAssertions.Execution;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Joins;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewFormatters;
using NUnit.Framework;
using SearchAndCompareUI.Tests.Unit.Tests.ViewFormatters;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewFormatters
{
    [TestFixture]
    public class CourseExtensionsTests
    {
        /// <summary>
        /// For multiplying up constants in metres for readable code.
        /// 1 Kilometer = 1000 metres.
        /// </summary>
        private const double Km = 1000;

        [Test]
        public void FormattedEarliestApplicationDate_WorksWithNullCampuses()
        {
            var sut = new Course
            {
                Campuses = null
            };

            var result = sut.FormattedEarliestApplicationDate();

            Assert.That(result, Is.EqualTo(string.Empty));
        }

        [Test]
        public void FormattedEarliestApplicationDate_WorksWithCampusWithNullApplicationsAcceptedFrom()
        {
            var sut = new Course
            {
                ApplicationsAcceptedFrom = null
            };

            var result = sut.FormattedEarliestApplicationDate();

            Assert.That(result, Is.EqualTo(string.Empty));
        }

        [Test]
        [TestCase(null, "Unknown")]
        [TestCase(1, "0 miles")] // rounded to nearest
        [TestCase(100, "0.1 miles")] // 0.0625 to nearest tenth of a mile
        [TestCase(400, "0.2 miles")] // 0.249 rounded to nearest tenth of a mile
        [TestCase(403, "0.3 miles")] // 0.2504 rounded to nearest tenth of a mile
        [TestCase(800, "0.5 miles")] // almost exactly half a mile (1.6mile/km)
        [TestCase(1.2 * Km, "0.7 miles")] // 0.746 rounded to nearest tenth of a mile
        [TestCase(1208, "0.8 miles")] // 0.7506 rounded to nearest tenth of a mile
        [TestCase(1.6 * Km, "1 mile")] // almost exactly a mile - use singular
        [TestCase(1.8 * Km, "1 mile")] // should still round down
        [TestCase(3.2 * Km, "2 miles")]
        [TestCase(10 * Km, "6 miles")]
        [TestCase(100 * Km, "62 miles")]
        [TestCase(1000 * Km, "621 miles")]
        public void FormattedDistanceTest(double? input, string expectedDisplayValue)
        {
            var formattedDistance = input.FormattedDistance();
            formattedDistance.Should().Be(expectedDisplayValue, $"for input of {input} metres");
        }

        [Test]
        public void CourseWithoutFunding_HasScholarshipAndBursary_IsFalse()
        {
            var course = CourseBuilder.BuildCourse("No funding");
            course.HasScholarshipAndBursary().Should().BeFalse("There is no funding on the course");
        }

        [Test]
        public void CourseWithBursary_HasScholarshipAndBursary_IsFalse()
        {
            var course = CourseBuilder.BuildCourse("Bursary")
                .AddBursarySubject();
            course.HasScholarshipAndBursary().Should().BeFalse("There is only a bursary on the course");
        }

        [Test]
        public void CourseWithBursaryAndScholarship_HasScholarshipAndBursary_IsTrue()
        {
            var course = CourseBuilder.BuildCourse("Scholarship")
                .AddBursaryAndScholarshipSubject();
            course.HasScholarshipAndBursary().Should().BeTrue("There is scholarship funding on the course");
        }

        [Test]
        public void CourseWithoutFunding_HasBursary_IsFalse()
        {
            var course = CourseBuilder.BuildCourse("No funding");
            course.HasBursary().Should().BeFalse("There is no funding on the course");
        }

        [Test]
        public void CourseWithBursary_HasBursary_IsTrue()
        {
            var course = CourseBuilder.BuildCourse("Bursary")
                .AddBursarySubject();
            course.HasBursary().Should().BeTrue("There is funding on the course");
        }

        [Test]
        public void CourseWithBursaryAndScholarship_HasBursary_IsTrue()
        {
            var course = CourseBuilder.BuildCourse("Scholarship")
                .AddBursaryAndScholarshipSubject();
            course.HasBursary().Should().BeTrue("There is scholarship funding on the course");
        }

        [Test]
        public void FundingOptions_Scholarship()
        {
            var course = CourseBuilder.BuildCourse("Scholarship")
                .AddBursaryAndScholarshipSubject();
            course.FundingOptions().Should().Be(CourseExtensions.FundingOption_Scholarship);
        }

        [Test]
        public void FundingOptions_Bursary()
        {
            var course = CourseBuilder.BuildCourse("Bursary")
                .AddBursarySubject();
            course.FundingOptions().Should().Be(CourseExtensions.FundingOption_Bursary);
        }

        [Test]
        public void FundingOptions_StudentFinance()
        {
            var course = CourseBuilder.BuildCourse("StudentFinance");
            course.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);
        }

        [Test]
        public void FundingOptions_Salary()
        {
            var course = CourseBuilder.BuildCourse("Salary")
                .AddSalary();
            course.FundingOptions().Should().Be(CourseExtensions.FundingOption_Salary);
        }

        // the 17 courses in prod that have funding in their secondary subject in the db but don't actually get funding
        [Test]
        [TestCase("Drama (with English)")]
        [TestCase("Drama (with English)")]
        [TestCase("Media Studies (with English)")]
        [TestCase("PE with Maths")]
        [TestCase("Physical Education (with EBacc Subject)")]
        [TestCase("Physical Education (with English 11-16)")]
        [TestCase("Physical Education (with Geography 11-16)")]
        [TestCase("Physical Education (with Mathematics 11-16)")]
        [TestCase("Physical Education with Biology")]
        [TestCase("Physical Education with Chemistry")]
        [TestCase("Physical Education with Computer Science")]
        [TestCase("Physical Education with English")]
        [TestCase("Physical Education with French")]
        [TestCase("Physical Education with Geography")]
        [TestCase("Physical Education with History")]
        [TestCase("Physical Education with Mathematics")]
        [TestCase("Physical Education with Maths specialism")]
        [TestCase("Physical Education with Physics")]
        [TestCase("Physical Education with Spanish")]
        public void OverriddenFunding(string courseName)
        {
            using (new AssertionScope())
            {
                var course1 = CourseBuilder.BuildCourse(courseName)
                    .AddBursarySubject()
                    .AddBursaryAndScholarshipSubject();
                course1.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);
                var course2 = CourseBuilder.BuildCourse(courseName)
                    .AddSubject()
                    .AddBursaryAndScholarshipSubject();
                course2.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);
                var course3 = CourseBuilder.BuildCourse(courseName)
                    .AddSubject()
                    .AddBursarySubject();
                course3.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);
                var course4 = CourseBuilder.BuildCourse(courseName)
                    .AddSubject();
                course4.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);
                var course5 = CourseBuilder.BuildCourse(courseName)
                    .AddSubject()
                    .AddSubject();
                course5.FundingOptions().Should().Be(CourseExtensions.FundingOption_StudentFinance);

                var course6 = CourseBuilder.BuildCourse(courseName)
                    .AddBursarySubject();
                course6.FundingOptions().Should().Be(CourseExtensions.FundingOption_Bursary);
                var course7 = CourseBuilder.BuildCourse(courseName)
                    .AddBursaryAndScholarshipSubject();
                course7.FundingOptions().Should().Be(CourseExtensions.FundingOption_Scholarship);
            }
        }
    }
}
