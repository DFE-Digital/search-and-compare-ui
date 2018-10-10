using System.Collections.Generic;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Microsoft.ApplicationInsights;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{
    [TestFixture]
    public class DynamicControllerTests
    {

        [Test]
        public async Task LocationSuggest_empty()
        {
            var query = "e15 1";
            var mockApi = new Mock<ISearchAndCompareApi>();
            var geocoderApi = new Mock<IGeocoder>();
            geocoderApi.Setup(x => x.SuggestLocationsAsync(query))
                .ReturnsAsync(new List<string>());

            var controller = new DynamicController(mockApi.Object, geocoderApi.Object, TelemetryClientHelper.GetMocked());

            var res = await controller.LocationSuggest(query);
            var jsonResult = res as JsonResult;
            Assert.IsNotNull(jsonResult);

            Assert.IsNotNull(jsonResult.Value);
            var jsonResultValue = jsonResult.Value as List<string>;
            Assert.IsNotNull(jsonResultValue);
            CollectionAssert.IsEmpty(jsonResultValue);
        }

        [Test]
        public async Task LocationSuggest()
        {
            var query = "e15 1";
            var mockApi = new Mock<ISearchAndCompareApi>();
            var geocoderApi = new Mock<IGeocoder>();
            geocoderApi.Setup(x => x.SuggestLocationsAsync(query))
                .ReturnsAsync(new List<string>() { query});

            var controller = new DynamicController(mockApi.Object, geocoderApi.Object, TelemetryClientHelper.GetMocked());

            var res = await controller.LocationSuggest(query);
            var jsonResult = res as JsonResult;
            Assert.IsNotNull(jsonResult);

            Assert.IsNotNull(jsonResult.Value);
            var jsonResultValue = jsonResult.Value as List<string>;
            Assert.IsNotNull(jsonResultValue);
            CollectionAssert.IsNotEmpty(jsonResultValue);
            Assert.AreEqual(query, jsonResultValue[0]);
            Assert.AreEqual(1, jsonResultValue.Count);
        }
    }
}
