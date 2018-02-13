using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Models;
using NUnit.Framework;
using Moq;
using MockQueryable.Moq;
using System;
using System.Linq.Expressions;
using MockQueryable;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests
{
    [TestFixture]
    public class PaginatedListTests
    {
        private int _pageSize = 10;
        private static List<string> _EmptySource = new List<string>();

        private static List<string> _SixItemSource = new List<string>()
        {
            "0", "1", "2", "3", "4", "5"
        };

        private static List<string> _TwelveItemSource = new List<string>()
        {
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "10", "11"
        };

        private void AssertTestCase(PaginatedList<string> result,
            bool expectedHasPrevious, bool expectedHasNext, int expectedTotal, int expectedIdx, int expectedCount)
        {
            Assert.Multiple(() =>
            {
                Assert.That(result.HasPreviousPage, Is.EqualTo(expectedHasPrevious), "HasPreviousPage");
                Assert.That(result.HasNextPage, Is.EqualTo(expectedHasNext), "HasNextPage");
                Assert.That(result.TotalPages, Is.EqualTo(expectedTotal), "TotalPages");
                Assert.That(result.PageIndex, Is.EqualTo(expectedIdx), "PageIndex");
                Assert.That(result.TotalCount, Is.EqualTo(expectedCount), "TotalCount");
            });
        }

        [TestCase(0,  10, false, false, 1, 1, 0)]
        [TestCase(1,  10, false, false, 1, 1, 0)]
        [TestCase(20, 10, false, false, 1, 1, 0)]
        [TestCase(-1, 10, false, false, 1, 1, 0)]
        [TestCase(-1, -1, false, false, 1, 1, 0)]
        public void PaginatedListTestCases_WithEmptySource(
            int pageIndex, int pageSize,
            bool expectedHasPrevious, bool expectedHasNext, int expectedTotal, int expectedIdx, int expectedCount)
        {
            var mockedIQueryable = _EmptySource.AsQueryable().BuildMockExtended();

            AssertTestCase(PaginatedList<string>.Create(mockedIQueryable.Object, pageIndex, pageSize),
                expectedHasPrevious, expectedHasNext, expectedTotal, expectedIdx, expectedCount);
        }

        [TestCase(0,  10, false, false, 1, 1, 6)]
        [TestCase(1,  10, false, false, 1, 1, 6)]
        [TestCase(20, 10, false, false, 1, 1, 6)]
        [TestCase(-1, 10, false, false, 1, 1, 6)]
        [TestCase(-1, -1, false,  true, 6, 1, 6)]
        public void PaginatedListTestCases_WithSixItemSource(
            int pageIndex, int pageSize,
            bool expectedHasPrevious, bool expectedHasNext, int expectedTotal, int expectedIdx, int expectedCount)
        {
            var mockedIQueryable = _SixItemSource.AsQueryable().BuildMockExtended();

            AssertTestCase(PaginatedList<string>.Create(mockedIQueryable.Object, pageIndex, pageSize),
                expectedHasPrevious, expectedHasNext, expectedTotal, expectedIdx, expectedCount);
        }

        [TestCase(-1, -1, false,  true, 12, 1, 12)]
        [TestCase(0,  10, false,  true,  2, 1, 12)]
        [TestCase(1,  10, false,  true,  2, 1, 12)]
        [TestCase(-1, 10, false,  true,  2, 1, 12)]
        [TestCase(2,  10, true,  false,  2, 2, 12)]
        [TestCase(3,  10, true,  false,  2, 2, 12)]
        [TestCase(2,   1, true,   true, 12, 2, 12)]
        [TestCase(2,  -1, true,   true, 12, 2, 12)]
        public void PaginatedListTestCases_WithTwelveItemSource(
            int pageIndex, int pageSize,
            bool expectedHasPrevious, bool expectedHasNext, int expectedTotal, int expectedIdx, int expectedCount)
        {
            var mockedIQueryable = _TwelveItemSource.AsQueryable().BuildMockExtended();

            AssertTestCase(PaginatedList<string>.Create(mockedIQueryable.Object, pageIndex, pageSize),
                expectedHasPrevious, expectedHasNext, expectedTotal, expectedIdx, expectedCount);
        }

        [Test]
        public void GivenAnEmptySource_WhenCreatingPaginatedList_ThenSkipNotCalledWithNegativeParameter()
        {
            var mockedIQueryable = _EmptySource.AsQueryable().BuildMockExtended();

            mockedIQueryable.AddCreateQueryShim((expression) => {
                var me = expression as MethodCallExpression;
                if (me != null && me.Method.Name == "Skip")
                {
                    var count = me.Arguments[1] as ConstantExpression;
                    if ((int)count.Value < 0)
                    {
                        throw new Exception(string.Format("Skip() called with count < 0 ({0})", (int)count.Value));
                    }
                }
            });

            // Throws if incorrect
            var result = PaginatedList<string>.Create(mockedIQueryable.Object, 0, 10);
        }
    }
}