using System;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Exceptions;
using GovUk.Education.SearchAndCompare.UI.Services;
using NUnit.Framework;
using System.Net.Http;
using FluentAssertions;

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
            geocoder = new Geocoder("AIzaSyBytKgqIJS_7wysO7ZFSgUb0I549SmX3yw", new HttpClient());
        }

        [Test]
        public void Throws_GoogleMapsApiServiceException()
        {
            var nullApiGeocoder = new Geocoder("bad_key", new HttpClient());
            Action act1 = () => nullApiGeocoder.ResolveAddressAsync("asdasdasdasd").Wait();
            act1.Should().ThrowExactly<GoogleMapsApiServiceException>();

            Action act2 = () => nullApiGeocoder.SuggestLocationsAsync("asdasdasdasd").Wait();
            act2.Should().ThrowExactly<GoogleMapsApiServiceException>();
        }

        [Test]
        public void Cambridge()
        {
            var res = geocoder.ResolveAddressAsync("CB4 1FJ");
            res.Wait();

            Assert.IsTrue(res.Result.FormattedLocation.StartsWith("Stott Gardens"));

            Assert.AreEqual("CB4 1FJ", res.Result.RawInput);
            Assert.LessOrEqual(52.2, res.Result.Latitude);
            Assert.GreaterOrEqual(52.3, res.Result.Latitude);

            Assert.LessOrEqual(0.1, res.Result.Longitude);
            Assert.GreaterOrEqual(0.2, res.Result.Longitude);

            Assert.AreEqual("postal_code", res.Result.Granularity);
            Assert.AreEqual("Cambridgeshire", res.Result.Region);
        }

        [Test]
        public void UkRegionBias()
        {
            // normally resolves to Haverhill, MA, USA. We want the one in Cambridgeshire.
            var res = geocoder.ResolveAddressAsync("Haverhill");
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
            var res = geocoder.ResolveAddressAsync("waeojfawei");
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
