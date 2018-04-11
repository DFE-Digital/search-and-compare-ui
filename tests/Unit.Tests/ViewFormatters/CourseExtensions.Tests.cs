using GovUk.Education.SearchAndCompare.UI.ViewFormatters;
using GovUk.Education.SearchAndCompare.Domain.Models;
using NUnit.Framework;
using System.Collections.Generic;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewFormatters
{
    [TestFixture]
    public class CourseExtensionsTests
    {
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
    }
}