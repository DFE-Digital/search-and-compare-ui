using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;


namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{
    [TestFixture]
    public class CourseControllerTests
    {
        [Test]
        public void Index()
        {
            var redirectUrlMock = new Mock<IRedirectUrlService>();
            redirectUrlMock.Setup(x => x.RedirectToNewApp("/course/abc/def")).Returns(new RedirectResult("frontend"));
            var mockApi = new Mock<ISearchAndCompareApi>();
            mockApi.Setup(x => x.GetCourse("abc","def")).Returns( new Course {Name = "my course", Fees = new Fees {Uk = 456}}).Verifiable();
            mockApi.Setup(x => x.GetFeeCaps()).Returns(new List<FeeCaps> {new FeeCaps {UkFees = 123}}).Verifiable();
            var controller = new CourseController(mockApi.Object, redirectUrlMock.Object);

            var res = controller.Index("abc", "def", new ResultsFilter());

            Assert.IsTrue(res is RedirectResult);
        }
    }
}
