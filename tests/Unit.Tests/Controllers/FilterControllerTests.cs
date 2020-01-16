using System.Net;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class FilterControllerTests
    {
        [Test]
        public void FundingHttpGetTest()
        {
            var controller = new FilterController(null, null, null, null)
            {
                TempData = new Mock<ITempDataDictionary>().Object
            };

            var filter = new ResultsFilter
            {
                funding = 2,
                hasvacancies = true,
            };
            var result = controller.Funding(filter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().Be(filter);
        }
    }
}
