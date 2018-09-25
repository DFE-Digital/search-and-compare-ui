using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class HomeControllerTests
    {
        private Mock<ISearchConfig> _searchConfigMock;
        private HomeController _homeController;

        [SetUp]
        public void SetUp()
        {
            _searchConfigMock = new Mock<ISearchConfig>();
            _homeController = new HomeController(_searchConfigMock.Object);
        }

        [Test]
        public void ReturnsIndexForPreLaunch()
        {
            _searchConfigMock.SetupGet(c => c.PreLaunchMode).Returns(true);
            var result = _homeController.Index();
            result.Should().BeOfType<ViewResult>();
            var viewResult = (ViewResult)result;
            viewResult.ViewName.Should().Be("Index");
        }

        [Test]
        public void RedirectsForPostLaunch()
        {
            _searchConfigMock.SetupGet(c => c.PreLaunchMode).Returns(false);
            var result = _homeController.Index();
            result.Should().BeOfType<RedirectToActionResult>();
        }
    }
}
