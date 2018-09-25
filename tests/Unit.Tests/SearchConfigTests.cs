using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests
{
    [TestFixture]
    public class SearchConfigTests
    {
        [Test]
        public void NoPassword()
        {
            var mockConfig = new Mock<IConfiguration>();
            ISearchConfig searchConfig = new SearchConfig(mockConfig.Object);
            searchConfig.SitePassword.Should().BeNull();
            searchConfig.PreLaunchMode.Should().BeFalse("no password when live");
        }

        [Test]
        public void PrelaunchPassword()
        {
            var mockConfig = new Mock<IConfiguration>();
            const string password = "correct horse battery staple";
            mockConfig.Setup(c => c["SITE_PASSWORD"]).Returns(password);
            ISearchConfig searchConfig = new SearchConfig(mockConfig.Object);
            searchConfig.SitePassword.Should().Be(password);
            searchConfig.PreLaunchMode.Should().BeTrue("password set when live");
        }
    }
}
