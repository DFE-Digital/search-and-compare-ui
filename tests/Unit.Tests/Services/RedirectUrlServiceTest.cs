using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Services;
using NUnit.Framework;
using FluentAssertions;
using System;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;


namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Services
{
    [TestFixture]
    public class RedirectUrlServiceTests
    {
        [Test]
        public void ReturnsRedirectResultToFrontend()
        {
            var configMock = new Mock<IConfiguration>();
            configMock.SetupGet(c => c["NEW_APP_URL"]).Returns("http://new-app:123");

            var searchAndCompareUrlService = new RedirectUrlService(configMock.Object);
            searchAndCompareUrlService.RedirectToNewApp("/course/123/4567").Url.Should().Be("http://new-app:123/course/123/4567");
        }
    }
}
