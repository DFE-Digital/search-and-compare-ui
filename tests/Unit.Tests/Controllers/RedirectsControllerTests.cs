using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class RedirecstControllerTests
    {
        [Test]
        public void RedirectsToLocationFilter()
        {
            var result = (new RedirectsController().StartLocation()) as RedirectToActionResult;
            result.Should().NotBeNull();
            result.ControllerName.Should().Be("Filter");
            result.ActionName.Should().Be("LocationWizard");
        }
    }
}
