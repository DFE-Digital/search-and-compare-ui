using GovUk.Education.SearchAndCompare.UI.Services;
using NUnit.Framework;
using FluentAssertions;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Services
{
    [TestFixture]
    public class RedirectUrlServiceTests
    {
         private Mock<IConfiguration> configMock;
         private Mock<IHttpContextAccessor> httpMock;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            configMock = new Mock<IConfiguration>();
            configMock.SetupGet(c => c["NEW_APP_URL"]).Returns("http://new-app:123");

            httpMock = new Mock<IHttpContextAccessor>();
        }

        [Test]
        public void ReturnsRedirectResultToNewApp_Path()
        {
            var searchAndCompareUrlService = new RedirectUrlService(configMock.Object, httpMock.Object);

            searchAndCompareUrlService.RedirectToNewApp("/course/123/4567").Url.Should().Be("http://new-app:123/course/123/4567");
        }

        [Test]
        public void ReturnsRedirectResultToNewApp_default_http_context()
        {
            var context = new DefaultHttpContext();

            httpMock.Setup(_ => _.HttpContext).Returns(context);

            var searchAndCompareUrlService = new RedirectUrlService(configMock.Object, httpMock.Object);

            searchAndCompareUrlService.RedirectToNewApp().Url.Should().Be("http://new-app:123/");
        }

        [Test]
        public void ReturnsRedirectResultToNewApp_default_http_context_with_path()
        {
            var context = new DefaultHttpContext();
            context.Request.Path = "/path";

            httpMock.Setup(_ => _.HttpContext).Returns(context);

            var searchAndCompareUrlService = new RedirectUrlService(configMock.Object, httpMock.Object);

            searchAndCompareUrlService.RedirectToNewApp().Url.Should().Be("http://new-app:123/path");
        }

        [Test]
        public void ReturnsRedirectResultToNewApp_default_http_context_with_path_and_querystring()
        {
            var context = new DefaultHttpContext();
            context.Request.Path = "/path";
            context.Request.QueryString = new QueryString("?query");

            httpMock.Setup(_ => _.HttpContext).Returns(context);

            var searchAndCompareUrlService = new RedirectUrlService(configMock.Object, httpMock.Object);

            searchAndCompareUrlService.RedirectToNewApp().Url.Should().Be("http://new-app:123/path?query");
        }
    }
}
