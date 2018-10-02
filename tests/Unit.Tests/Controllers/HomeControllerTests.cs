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
        private HomeController _homeController;

        [Test]
        public void RedirectsToLocationFilter()
        {
            var result = _homeController.Index();
            result.Should().BeOfType<RedirectToActionResult>();
        }
    }
}
