

using System;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{
    [TestFixture]
    public class CourseControllerTests
    {
        private Mock<ISearchAndCompareApi> mockApi;
        private CourseController sut;

        [SetUp]
        public void SetUp()
        {
            mockApi = new Mock<ISearchAndCompareApi>();
            sut = new CourseController(mockApi.Object);
        }

        [Test]
        public void Index_CallsApiCorrectly()
        {
            mockApi.Setup(x => x.GetCourse("XYZ", "1AB")).Returns(GetSimpleCourse()).Verifiable();
            mockApi.Setup(x => x.GetFeeCaps()).Returns(GetFeeCaps()).Verifiable();

            var actionResult = sut.Index("XYZ", "1AB", new Filters.ResultsFilter());

            Assert.That(actionResult is ViewResult);
            Assert.That((actionResult as ViewResult).Model is CourseViewModel);

            var courseViewModel = (actionResult as ViewResult).Model as CourseViewModel;

            Assert.AreEqual("My course", courseViewModel.Course.Name);
            Assert.AreEqual(200, courseViewModel.Finance.FeeCaps.InternationalFees);
            mockApi.VerifyAll();
        }

        [Test]
        public void RedirectToUcasCourse_CallsApiCorrectly()
        {
            mockApi.Setup(x => x.GetUcasCourseUrl("XYZ", "1AB")).Returns("http://ucas.com").Verifiable();

            var redirectResult = sut.RedirectToUcasCourse("XYZ", "1AB");

            Assert.IsFalse(redirectResult.Permanent);
            Assert.AreEqual("http://ucas.com", redirectResult.Url);
            mockApi.VerifyAll();
        }

        private List<FeeCaps> GetFeeCaps()
        {
            return new List<FeeCaps>
            {
                new FeeCaps
                {
                    EndYear = 2000,
                    UkFees = 100,
                    EuFees = 100,
                    InternationalFees = 200
                }
            };
        }

        private Course GetSimpleCourse()
        {
            return new Course
            {
                Name = "My course",
                ProgrammeCode = "1AB"
            };
        }
    }
}