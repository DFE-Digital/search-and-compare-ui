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
                fulltime = true,
                parttime = false,
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
            _mockFlag.Setup(x => x.RedirectToRailsPageFunding).Returns(true);
            string actualRedirectPath = "results/filter/funding?query";

            var redirectObject = new RedirectResult(actualRedirectPath);
            _redirectUrlMock.Setup(x => x.RedirectToNewApp())
                .Returns(redirectObject);

            var result = _filterController.Funding(_resultsFilter) as RedirectResult;
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(), Times.AtLeastOnce);
            result.Url.Should().Be(actualRedirectPath);
        }

        [Test]
        public void StudyTypeHttpGetTest()
        {
            var result = _filterController.StudyType(_resultsFilter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().Be(_resultsFilter);
        }

        [Test]
        public void StudyTypeRedirectsToNewApp()
        {
            _mockFlag.Setup(x => x.RedirectToRailsPageStudyType).Returns(true);
            string actualRedirectPath = "results/filter/studytype?query";

            var redirectObject = new RedirectResult(actualRedirectPath);
            _redirectUrlMock.Setup(x => x.RedirectToNewApp())
                .Returns(redirectObject);

            var result = _filterController.StudyType(_resultsFilter) as RedirectResult;
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(), Times.AtLeastOnce);
            result.Url.Should().Be(actualRedirectPath);
        }

        [Test]
        public void VacancyHttpGetTest()
        {
            var result = _filterController.Vacancy(_resultsFilter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().Be(_resultsFilter);
        }

        [Test]
        public void VacancyRedirectsToNewApp()
        {
            _mockFlag.Setup(x => x.RedirectToRailsPageVacancy).Returns(true);
            string actualRedirectPath = "results/filter/vacancy?query";

            var redirectObject = new RedirectResult(actualRedirectPath);
            _redirectUrlMock.Setup(x => x.RedirectToNewApp())
                .Returns(redirectObject);

            var result = _filterController.Vacancy(_resultsFilter) as RedirectResult;
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(), Times.AtLeastOnce);
            result.Url.Should().Be(actualRedirectPath);
        }

        [Test]
        public void QualificationGetHttpGetTest()
        {
            var result = _filterController.QualificationGet(_resultsFilter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().Be(_resultsFilter);
        }

        [Test]
        public void QualificationGetRedirectsToNewApp()
        {
            _mockFlag.Setup(x => x.RedirectToRailsPageQualification).Returns(true);
            string actualRedirectPath = "results/filter/qualification?query";

            var redirectObject = new RedirectResult(actualRedirectPath);
            _redirectUrlMock.Setup(x => x.RedirectToNewApp())
                .Returns(redirectObject);

            var result = _filterController.QualificationGet(_resultsFilter) as RedirectResult;
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(), Times.AtLeastOnce);
            result.Url.Should().Be(actualRedirectPath);
        }
    }
}