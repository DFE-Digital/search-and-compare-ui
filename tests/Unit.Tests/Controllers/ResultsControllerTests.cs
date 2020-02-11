using System.Collections.Generic;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class ResultsControllerTests
    {
        private ResultsController _resultsController;
        private ResultsFilter _resultsFilter;
        private Mock<IFeatureFlags> _mockFlag;
        private Mock<ISearchAndCompareApi> _mockApi;
        private Mock<IRedirectUrlService> _redirectUrlMock;

        [SetUp]
        public void SetUp()
        {
            _mockApi = new Mock<ISearchAndCompareApi>();
            _mockFlag = new Mock<IFeatureFlags>();

            _redirectUrlMock = new Mock<IRedirectUrlService>();
            _resultsController = new ResultsController(_mockApi.Object,
                _mockFlag.Object,
                _redirectUrlMock.Object)
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
        public void IndexHttpGetTest()
        {
            _mockApi.Setup(x => x.GetSubjects()).Returns(new List<Subject>());
            var result = _resultsController.Index(_resultsFilter);
            result.Should().BeOfType<ViewResult>();
            var viewResult = result as ViewResult;
            viewResult?.Model.Should().BeOfType<ResultsViewModel>();
        }

        [Test]
        public void IndexRedirectsToNewApp()
        {
            _mockFlag.Setup(x => x.RedirectToRailsPageResults).Returns(true);
            string actualRedirectPath = "results?query";

            var redirectObject = new RedirectResult(actualRedirectPath);
            _redirectUrlMock.Setup(x => x.RedirectToNewApp())
                .Returns(redirectObject);

            var result = _resultsController.Index(_resultsFilter) as RedirectResult;
            result.Should().Be(redirectObject);
            _redirectUrlMock.Verify(x => x.RedirectToNewApp(), Times.AtLeastOnce);
            result.Url.Should().Be(actualRedirectPath);
        }
    }
}
