using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewFormatters;
using NUnit.Framework;
using System.Collections.Generic;
using FluentAssertions;

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
        [TestCase(500, " miles")] // missing value is a bug to be fixed, test to document existing behaviour
        [TestCase(1*Km, "1 miles")]
        [TestCase(10*Km, "6 miles")]
        [TestCase(100*Km, "62 miles")]
        [TestCase(1000*Km, "621 miles")]
        public void FormattedDistanceTest(double? input, string expectedDisplayValue)
        {
            var formattedDistance = input.FormattedDistance();
            formattedDistance.Should().Be(expectedDisplayValue, $"for input of {input} metres");
        }
    }
}
