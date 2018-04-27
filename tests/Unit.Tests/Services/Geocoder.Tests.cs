using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Services;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Services
{
    [Category("APIs")]
    [Explicit]
    class GeocoderTests
    {
        IGeocoder geocoder;

        [SetUp]
        public void SetUp()
        {
            geocoder = new Geocoder("AIzaSyC6CQg447XEuO95H6aIUkMKVqEeFwrboUk");
        }

        [Test]
        public void Cambridge()
        {
            var res = geocoder.ResolvePostCodeAsync("CB4 1FJ");
            res.Wait();

            Assert.IsTrue(res.Result.FormattedLocation.StartsWith("Stott Gardens"));

            Assert.AreEqual("CB4 1FJ", res.Result.RawInput);
            Assert.LessOrEqual(52.2, res.Result.Latitude);
            Assert.GreaterOrEqual(52.3, res.Result.Latitude);

            Assert.LessOrEqual(0.1, res.Result.Longitude);
            Assert.GreaterOrEqual(0.2, res.Result.Longitude);
        }

        [Test]
        public void UkRegionBias()
        {
            // normally resolves to Haverhill, MA, USA. We want the one in Cambridgeshire.
            var res = geocoder.ResolvePostCodeAsync("Haverhill");
            res.Wait();

            Assert.IsTrue(res.Result.FormattedLocation.StartsWith("Haverhill CB9"));

            Assert.AreEqual("Haverhill", res.Result.RawInput);
            Assert.LessOrEqual(52.0, res.Result.Latitude);
            Assert.GreaterOrEqual(52.2, res.Result.Latitude);

            Assert.LessOrEqual(0.4, res.Result.Longitude);
            Assert.GreaterOrEqual(0.5, res.Result.Longitude);
        }

        [Test]
        public void Nonsense()
        {
            var res = geocoder.ResolvePostCodeAsync("waeojfawei");
            res.Wait();
            Assert.IsNull(res.Result);
        }

        [Test]
        public void NotInUk()
        {
            var res = geocoder.ResolvePostCodeAsync("Sweden");
            res.Wait();
            Assert.IsNull(res.Result);
        }

        [Test]
        public void Autocomplete()
        {
            var res = geocoder.SuggestLocationsAsync("Cambr");
            res.Wait();

            var suggestions = res.Result;

            Assert.Greater(suggestions.Count(), 0, "Cambr should give suggestions");
            Assert.That(suggestions.First(), Is.EqualTo("Cambridge, UK"), "Cambr should give Cambridge, UK");
        }
    }
}
