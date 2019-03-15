using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Data;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewComponents;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.ViewModels;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewComponents
{
    [TestFixture]
    public class SuggestedSearchTests
    {
        [Test]
        public void EmptyDoesntThrow()
        {
            var empty = new ResultsViewModel
            {
                Map = new MapViewModel(),
                Courses = new PaginatedList<Course>(),
                Subjects = new FilteredList<Subject>(),
                FilterModel = new ResultsFilter()
            };

            var mockApi = new Mock<ISearchAndCompareApi>();
            mockApi.Setup(x => x.GetCoursesTotalCount(It.IsAny<QueryFilter>())).Returns(new TotalCountResult());

            var res = new SuggestedSearch(mockApi.Object, new Mock<ILogger<SuggestedSearch>>().Object)
                .InvokeAsync(empty, 100).Result;

            Assert.That(res is ViewViewComponentResult);
        }
    }

}