using System;
using System.Net.Http;
using System.Web;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Services;
using Moq;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Services
{
    class GoogleAnalyticsTests
    {
        [Test]
        public void ProperlyFormedRequest()
        {
            var mockHttp = new Mock<IHttpClient>();
            Uri resUri = null;
            StringContent resContent = null;

            mockHttp.Setup(x => x.PostAsync(It.IsAny<Uri>(), It.IsAny<StringContent>()))
                .Callback((Uri a, StringContent b) => {resUri = a; resContent = b;})
                .ReturnsAsync(new HttpResponseMessage());

            var sut = new GoogleAnalyticsClient(mockHttp.Object, "abc");

            sut.TrackEvent("cid", "eventCategory", "eventAction", "eventLabel").Wait();

            resUri.AbsoluteUri.Should().Be("https://www.google-analytics.com/collect");

            var collection = HttpUtility.ParseQueryString(resContent.ReadAsStringAsync().Result);
            collection["v"].Should().Be("1");
            collection["tid"].Should().Be("abc");
            collection["cid"].Should().Be("cid");
            collection["t"].Should().Be("event");
            collection["ec"].Should().Be("eventCategory");
            collection["ea"].Should().Be("eventAction");
            collection["el"].Should().Be("eventLabel");
            collection.Count.Should().Be(7);
        }
        
    }
}
