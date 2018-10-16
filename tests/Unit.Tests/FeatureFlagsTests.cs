using FluentAssertions;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests
{
    [TestFixture]
    public class FeatureFlagsTests
    {
        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        [Test]
        public void FeatureFlagConfigTests(string configValue, bool expected)
        {
            var config = new Mock<IConfiguration>();
            const string key = "FEATURE_THING";
            config.Setup(c => c[key]).Returns(configValue);
            var featureFlags = new FeatureFlags(config.Object);
            featureFlags.ShouldShow(key).Should().Be(expected);
        }
    }
}
