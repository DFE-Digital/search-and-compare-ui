using System.Collections.Generic;
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

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
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

        private Mock<ISearchAndCompareApi> GetMockApi(List<SubjectArea> subjectAreas)
        {
            var mockApi = new Mock<ISearchAndCompareApi>();
            mockApi.Setup(api => api.GetSubjectAreas())
                .Returns(subjectAreas);
            return mockApi;
        }

        public void GivenSomeSubjects_WhenSubjectGetCalledWithNullSubjectFilter_ThenViewModelHasAllSubjects()
        {
            var inputSubjectFilter = string.Empty;
            var expectedSelected = new List<int> { 1, 2, 3, 4 };

            var mockApi = GetMockApi(_subjectAreas);
            var mockGeocoder = new Mock<IGeocoder>();
            var controller = new FilterController(mockApi.Object, mockGeocoder.Object);

            var result = controller.SubjectGet(new ResultsFilter { subjects = inputSubjectFilter }) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            Assert.That(resultsViewModel.SubjectAreas.Count, Is.EqualTo(4));
            Assert.That(resultsViewModel.SubjectAreas, Is.EquivalentTo(_subjectAreas));
            Assert.That(resultsViewModel.FilterModel.SelectedSubjects, Is.EquivalentTo(expectedSelected));
            Assert.That(viewData["Page"], Is.EqualTo(1));
            Assert.That(viewData["SubjectFilter"], Is.EqualTo(inputSubjectFilter));
        }

        public void GivenSomeSubjects_WhenSubjectGetCalledWithSubjectFilter_ThenViewModelHasSubjectsSelected()
        {
            var inputSubjectFilter = "1,2";
            var expectedSelected = new List<int> { 1, 2 };

            var mockApi = GetMockApi(_subjectAreas);
            var mockGeocoder = new Mock<IGeocoder>();
            var controller = new FilterController(mockApi.Object, mockGeocoder.Object);

            var result = controller.SubjectGet(new ResultsFilter { subjects = inputSubjectFilter }) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            Assert.That(resultsViewModel.FilterModel.SelectedSubjects, Is.EquivalentTo(expectedSelected));
            Assert.That(viewData["SubjectFilter"], Is.EqualTo(inputSubjectFilter));
        }

        public void GivenSubjectAction_WhenSubjectGetCalledWithPageIndex_ThenViewDataHasPageIndexSet()
        {
            var inputPage = 1;
            var expectedSelected = new List<int> { 1, 2 };

            var mockApi = GetMockApi(_subjectAreas);
            var mockGeocoder = new Mock<IGeocoder>();
            var controller = new FilterController(mockApi.Object, mockGeocoder.Object);

            var result = controller.SubjectGet(new ResultsFilter
            {
                page = inputPage
            }) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel)result.Model;

            Assert.That(resultsViewModel.FilterModel.page, Is.EqualTo(inputPage));
        }
    }
}
