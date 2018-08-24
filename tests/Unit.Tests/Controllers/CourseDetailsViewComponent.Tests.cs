

using System;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Shared.Services;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewComponents;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Moq;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{
    [TestFixture]
    public class CourseDetailsViewComponentTests
    {
        private Mock<ICourseDetailsService> mockApi;
        private CourseDetailsViewComponent sut;

        [SetUp]
        public void SetUp()
        {
            mockApi = new Mock<ICourseDetailsService>();
            sut = new CourseDetailsViewComponent(mockApi.Object);
        }

        [Test]
        public void Index_CallsApiCorrectly()
        {
            mockApi.Setup(x => x.GetCourse("XYZ", "1AB")).Returns(GetSimpleCourse()).Verifiable();
            mockApi.Setup(x => x.GetFeeCaps()).Returns(GetFeeCaps()).Verifiable();

            var actionResult = sut.Invoke("XYZ", "1AB");

            Assert.That(actionResult is ViewViewComponentResult);
            Assert.That((actionResult as ViewViewComponentResult).ViewData.Model is CourseDetailsViewModel);

            var courseViewModel = (actionResult as ViewViewComponentResult).ViewData.Model as CourseDetailsViewModel;

            Assert.AreEqual("My course", courseViewModel.Course.Name);
            Assert.AreEqual(200, courseViewModel.Finance.FeeCaps.InternationalFees);
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