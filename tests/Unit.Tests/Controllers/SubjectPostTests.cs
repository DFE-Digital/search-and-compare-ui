using System.Collections.Generic;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;
using GovUk.Education.SearchAndCompare.Services;
using GovUk.Education.SearchAndCompare.UI.Utils;
using Microsoft.AspNetCore.Http;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{

    [TestFixture]
    public class SubjectPostTests
    {

        private readonly List<SubjectArea> _subjectAreas = new List<SubjectArea>
        {
            new SubjectArea
            {
                Subjects = new List<Subject>
                {
                    new Subject { Id = 1 },
                    new Subject { Id = 2 },
                }
            },
            new SubjectArea
            {
                Subjects = new List<Subject>
                {
                    new Subject { Id = 3 },
                    new Subject { Id = 4 },
                }
            }
        };

        private FilterController _filterController;

        [SetUp]
        public void SetUp()
        {
            var mockApi = GetMockApi(_subjectAreas);
            var mockGeocoder = new Mock<IGeocoder>();

            _filterController = new FilterController(mockApi.Object, mockGeocoder.Object, TelemetryClientHelper.GetMocked(),
                new GoogleAnalyticsClient(null, null));
            var tempDataMock = new Mock<ITempDataDictionary>();
            var tempUrlMock = new Mock<IUrlHelper>();
            _filterController.TempData = tempDataMock.Object;
            _filterController.Url = tempUrlMock.Object;
        }
        [Test]
        public void GivenSubjectAction_WhenSenCoursesSelectedWithNoSubjects_ThenNoErrorMessage()
        {
            var inputPage = 1;
            var expectedSelected = new List<int>();//no subjects selected

            _filterController.TempData = new TempDataDictionary(new DefaultHttpContext(), Mock.Of<ITempDataProvider>());
            var result = _filterController.SubjectPost(new ResultsFilter
            {
                page = inputPage,
                SelectedSubjects = expectedSelected,
                senCourses = true
            }) as ViewResult;

            _filterController.TempData.Count.Should().Be(0);
        }
        [Test]
        public void GivenSubjectAction_WhenSenCoursesNotSelectedWithNoSubjects_ThenErrorMessage()
        {
            var inputPage = 1;
            var expectedSelected = new List<int>();//no subjects selected

            _filterController.TempData = new TempDataDictionary(new DefaultHttpContext(), Mock.Of<ITempDataProvider>());
            var result = _filterController.SubjectPost(new ResultsFilter
            {
                page = inputPage,
                SelectedSubjects = expectedSelected,
                senCourses = false
            }) as ViewResult;

            _filterController.TempData.Count.Should().Be(1);
            var error = _filterController.TempData.Get<ErrorViewModel>("Errors");

            error.Messages.Count.Should().Be(1);
            error.Messages[0].Name.Should().Be("Please choose at least one subject");
        }
        [Test]
        public void GivenSubjectAction_WhenSenCoursesIsSelectedWithSubjects_ThenNoErrorMessage()
        {
            var inputPage = 1;
            var expectedSelected = new List<int> { 1, 2 };

            _filterController.TempData = new TempDataDictionary(new DefaultHttpContext(), Mock.Of<ITempDataProvider>());
            var result = _filterController.SubjectPost(new ResultsFilter
            {
                page = inputPage,
                SelectedSubjects = expectedSelected,
                senCourses = true
            }) as ViewResult;

            _filterController.TempData.Count.Should().Be(0);
        }
        [Test]
        public void GivenSubjectAction_WhenSenCoursesNotSelectedWithSubjects_ThenNoErrorMessage()
        {
            var inputPage = 1;
            var expectedSelected = new List<int> { 1, 2 };

            _filterController.TempData = new TempDataDictionary(new DefaultHttpContext(), Mock.Of<ITempDataProvider>());
            var result = _filterController.SubjectPost(new ResultsFilter
            {
                page = inputPage,
                SelectedSubjects = expectedSelected,
                senCourses = false
            }) as ViewResult;

            _filterController.TempData.Count.Should().Be(0);
        }
        private Mock<ISearchAndCompareApi> GetMockApi(List<SubjectArea> subjectAreas)
        {
            var mockApi = new Mock<ISearchAndCompareApi>();
            mockApi.Setup(api => api.GetSubjectAreas())
                .Returns(subjectAreas);
            return mockApi;
        }
    }
}
