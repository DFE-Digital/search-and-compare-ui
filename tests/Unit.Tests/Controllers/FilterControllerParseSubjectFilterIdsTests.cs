using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class FilterControllerParseSubjectFilterIdsTests
    {
        [Test]
        public void GivenAnEmptySubjectFilterString_WhenCalled_ThenReturnsEmptyList()
        {
            var result = new QueryFilter { subjects = "" }.SelectedSubjects;

            Assert.That(result, Is.TypeOf<List<int>>());
            Assert.That(result, Is.Empty);
        }

        [Test]
        public void GivenANullSubjectFilterString_WhenCalled_ThenReturnsEmptyList()
        {
            var result = new QueryFilter().SelectedSubjects;

            Assert.That(result, Is.TypeOf<List<int>>());
            Assert.That(result, Is.Empty);
        }

        [Test]
        public void GivenASingleItemSubjectFilterString_WhenCalled_ThenReturnsListWithOneInt()
        {
            var result = new QueryFilter { subjects = "1" }.SelectedSubjects;

            Assert.That(result, Is.TypeOf<List<int>>());
            Assert.That(result, Is.EquivalentTo(new List<int> { 1 }));
        }

        [Test]
        public void GivenACommaSeparatedItemsSubjectFilterString_WhenCalled_ThenReturnsListWithCorrectInts()
        {
            var result = new QueryFilter { subjects = "1,2,3" }.SelectedSubjects;

            Assert.That(result, Is.TypeOf<List<int>>());
            Assert.That(result, Is.EquivalentTo(new List<int> { 1, 2, 3 }));
        }
    }
}
