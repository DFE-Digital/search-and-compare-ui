using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Services;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using GovUk.Education.SearchAndCompare.UI.Unit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class FilterControllerTests
    {
        private FilterController _filterController;
        private ResultsFilter _resultsFilter;
        private Mock<IFeatureFlags> _mockFlag;
        private Mock<IRedirectUrlService> _redirectUrlMock;

        [SetUp]
        public void SetUp()
        {
            var mockApi = new Mock<ISearchAndCompareApi>();
            _mockFlag = new Mock<IFeatureFlags>();
            var mockGeocoder = new Mock<IGeocoder>();

            _redirectUrlMock = new Mock<IRedirectUrlService>();
            _filterController = new FilterController(mockApi.Object, mockGeocoder.Object,
                TelemetryClientHelper.GetMocked(),
                new GoogleAnalyticsClient(null, null),
                _redirectUrlMock.Object,
                _mockFlag.Object)
            {
                TempData = new Mock<ITempDataDictionary>().Object
            };
            _resultsFilter = new ResultsFilter
            {
                funding = 2,
                hasvacancies = true,
            };
        }

        [Test]
        public void FundingHttpGetTest()
        {
            var result = _filterController.Funding(_resultsFilter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().Be(_resultsFilter);
        }

        [Test]
        public void FundingRedirectsToNewApp()
        {
            _mockFlag.Setup(x => x.RedirectToRails).Returns(true);
            var redirectObject = new RedirectResult("frontend");
            string actualRedirectPath = null;
            _redirectUrlMock.Setup(x => x.RedirectToNewApp(It.IsAny<string>()))
                .Callback<string>(x => actualRedirectPath = x)
                .Returns(redirectObject);
            var result = _filterController.Funding(_resultsFilter);
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(It.IsAny<string>()));
            // Use callbacks to get expected string when test fails. https://thomasardal.com/using-moq-callbacks-as-verify/
            actualRedirectPath.Should().Be("results/filter/funding?todo");
        }
    }
}
