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

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageSubjectWizard(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("SubjectWizard", configValue, expected);
            featureFlag.RedirectToRailsPageSubjectWizard.Should().Be(expected);
        }
        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageSubject(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Subject", configValue, expected);
            featureFlag.RedirectToRailsPageSubject.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageLocation(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Location", configValue, expected);
            featureFlag.RedirectToRailsPageLocation.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageFunding(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Funding", configValue, expected);
            featureFlag.RedirectToRailsPageFunding.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageQualification(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Qualification", configValue, expected);
            featureFlag.RedirectToRailsPageQualification.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageStudyType(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("StudyType", configValue, expected);
            featureFlag.RedirectToRailsPageStudyType.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageVacancy(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Vacancy", configValue, expected);
            featureFlag.RedirectToRailsPageVacancy.Should().Be(expected);
        }

        [TestCase(null, false)]
        [TestCase("", false)] // this one took down prod
        [TestCase("   ", false)]
        [TestCase(" false  ", false)]
        [TestCase("false", false)]
        [TestCase("False", false)]
        [TestCase("true", true)]
        [TestCase("True", true)]
        public void RedirectToRailsPageCourse(string configValue, bool expected)
        {
            var featureFlag = GetFeatureFlags("Course", configValue, expected);
            featureFlag.RedirectToRailsPageCourse.Should().Be(expected);
        }

        private IFeatureFlags GetFeatureFlags(string suffixKey, string configValue, bool expected)
        {
            var config = new Mock<IConfiguration>();
            const string prefixKey = "FEATURE_REDIRECT_TO_RAILS";
            var key = $"{prefixKey}_{suffixKey}".ToUpperInvariant();
            config.Setup(c => c[key]).Returns(configValue);
            var featureFlags = new FeatureFlags(config.Object);
            featureFlags.ShouldShow(key).Should().Be(expected);

            return featureFlags;
        }
    }
}
