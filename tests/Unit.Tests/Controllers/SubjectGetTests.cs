using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security.Policy;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Moq;
using NUnit.Framework;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using GovUk.Education.SearchAndCompare.Services;
using GovUk.Education.SearchAndCompare.UI.Utils;
using Microsoft.AspNetCore.Http;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{

    [TestFixture]
    public class SubjectGetTests
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
            _filterController.TempData = tempDataMock.Object;
        }

        [Test]
        public void GivenSomeSubjects_WhenSubjectGetCalledWithNullSubjectFilter_ThenViewModelHasAllSubjects()
        {
            var inputSubjectFilter = string.Empty;
            var expectedSelected = new List<int> { 1, 2, 3, 4 };

            var result = _filterController.SubjectGet(new ResultsFilter { subjects = inputSubjectFilter, SelectedSubjects = expectedSelected}) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            resultsViewModel.SubjectAreas.Count.Should().Be(2);
            resultsViewModel.SubjectAreas.Should().BeSameAs(_subjectAreas);
            resultsViewModel.FilterModel.SelectedSubjects.Should().BeEquivalentTo(expectedSelected);
            viewData.Count.Should().Be(1);
        }

        [Test]
        public void GivenSomeSubjects_WhenSubjectGetCalledWithSubjectFilter_ThenViewModelHasSubjectsSelected()
        {
            var inputSubjectFilter = "1,2";
            var expectedSelected = new List<int> { 1, 2 };

            var result = _filterController.SubjectGet(new ResultsFilter { subjects = inputSubjectFilter }) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            resultsViewModel.FilterModel.SelectedSubjects.Should().BeEquivalentTo(expectedSelected);
            resultsViewModel.FilterModel.subjects.Should().BeSameAs(inputSubjectFilter);
            viewData.Count.Should().Be(1);
        }

        [Test]
        public void GivenSubjectAction_WhenSubjectGetCalledWithPageIndex_ThenViewDataHasPageIndexSet()
        {
            var inputPage = 1;
            var expectedSelected = new List<int> { 1, 2 };

            var result = _filterController.SubjectGet(new ResultsFilter
            {
                page = inputPage
            }) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            Assert.That(resultsViewModel.FilterModel.page, Is.EqualTo(inputPage));
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
