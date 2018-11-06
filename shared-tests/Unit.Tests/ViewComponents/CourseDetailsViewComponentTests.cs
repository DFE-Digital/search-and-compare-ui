using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewComponents;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Tests.Unit.Tests.ViewComponents
{
    [TestFixture]
    public class CourseDetailsViewComponentTests
    {
        [Test]
        public void TestIt()
        {
            var viewComponentContext = new ViewComponentContext
            {
                ViewContext = new ViewContext {HttpContext = new DefaultHttpContext()}
            };
            var courseDetailsView = new CourseDetailsViewComponent();
            CourseDetailsViewModel course = null;
            var result = courseDetailsView.Invoke(course) as ViewViewComponentResult;
            result.Should().NotBeNull();
            result.Execute(viewComponentContext);
        }
    }
}
