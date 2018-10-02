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
        [Test]
        public void RedirectsToLocationFilter()
        {
            var result = new HomeController().Index();
            result.Should().BeOfType<RedirectToActionResult>();
        }
    }
}
