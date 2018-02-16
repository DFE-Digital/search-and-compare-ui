using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Models;
using NUnit.Framework;
using Moq;
using MockQueryable.Moq;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.DatabaseAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.Controllers
{
    [TestFixture]
    public class FilterControllerTests
    {
        [TestFixture]
        public class FilterControllerParseSubjectFilterIdsTests
        {
            [Test]
            public void GivenAnEmptySubjectFilterString_WhenCalled_ThenReturnsEmptyList()
            {
                var result = new ResultsFilterViewModel{subjects = ""}.SelectedSubjects;
                
                Assert.That(result, Is.TypeOf<List<int>>());
                Assert.That(result, Is.Empty);
            }

            [Test]
            public void GivenANullSubjectFilterString_WhenCalled_ThenReturnsEmptyList()
            {
                var result = new ResultsFilterViewModel().SelectedSubjects;

                Assert.That(result, Is.TypeOf<List<int>>());
                Assert.That(result, Is.Empty);
            }

            [Test]
            public void GivenASingleItemSubjectFilterString_WhenCalled_ThenReturnsListWithOneInt()
            {
                var result = new ResultsFilterViewModel{subjects= "1"}.SelectedSubjects;

                Assert.That(result, Is.TypeOf<List<int>>());
                Assert.That(result, Is.EquivalentTo(new List<int>() {1}));
            }

            [Test]
            public void GivenACommaSeparatedItemsSubjectFilterString_WhenCalled_ThenReturnsListWithCorrectInts()
            {
                var result = new ResultsFilterViewModel{subjects = "1,2,3"}.SelectedSubjects;

                Assert.That(result, Is.TypeOf<List<int>>());
                Assert.That(result, Is.EquivalentTo(new List<int>() {1,2,3}));
            }
        }

        private Mock<ICourseDbContext> GetMockContext(List<SubjectArea> subjectAreas)
        {
            var mockSubjectAreas = subjectAreas.AsQueryable().BuildMock();

            var mockContext = new Mock<ICourseDbContext>();
            mockContext.Setup(context => context.GetOrderedSubjectsByArea())
                       .Returns(mockSubjectAreas.Object);

            return mockContext;
        }

        private List<SubjectArea> _subjectAreas = new List<SubjectArea>()
        {
            new SubjectArea() {
                Subjects = new List<Subject>()
                {
                    new Subject() { Id = 1 },
                    new Subject() { Id = 2 },
                }
            },
            new SubjectArea() {
                Subjects = new List<Subject>()
                {
                    new Subject() { Id = 3 },
                    new Subject() { Id = 4 },
                }
            }
        };

        public void GivenSomeSubjects_WhenCalledWithNullSubjectFilter_ThenViewModelHasAllSubjects()
        {
            var inputSubjectFilter = string.Empty;
            var expectedSelected = new List<int>() { 1, 2, 3, 4 };

            var mockContext = GetMockContext(_subjectAreas);
            var controller = new ResultsController(mockContext.Object, AnalyticsPolicy.No);

            var result = controller.Index(new ResultsFilterViewModel{subjects = inputSubjectFilter}) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel) result.Model;

            Assert.That(resultsViewModel.SubjectAreas.Count(), Is.EqualTo(4));
            Assert.That(resultsViewModel.SubjectAreas, Is.EquivalentTo(_subjectAreas));
            Assert.That(resultsViewModel.FilterModel.SelectedSubjects, Is.EquivalentTo(expectedSelected));
            Assert.That(viewData["Page"], Is.EqualTo(1));
            Assert.That(viewData["SubjectFilter"], Is.EqualTo(inputSubjectFilter));
        }

        public void GivenSomeSubjects_WhenCalledWithSubjectFilter_ThenViewModelHasSubjectsSelected()
        {
            var inputSubjectFilter = "1,2";
            var expectedSelected = new List<int>() { 1, 2 };

            var mockContext = GetMockContext(_subjectAreas);
            var controller = new ResultsController(mockContext.Object, AnalyticsPolicy.No);

            var result = controller.Index(new ResultsFilterViewModel{subjects = inputSubjectFilter}) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel) result.Model;

            Assert.That(resultsViewModel.FilterModel.SelectedSubjects, Is.EquivalentTo(expectedSelected));
            Assert.That(viewData["SubjectFilter"], Is.EqualTo(inputSubjectFilter));
        }

        public void GivenSubjectAction_WhenCalledWithPageIndex_ThenViewDataHasPageIndexSet()
        {
            var inputSubjectFilter = "1,2";
            var expectedSelected = new List<int>() { 1, 2 };

            var mockContext = GetMockContext(_subjectAreas);
            var controller = new ResultsController(mockContext.Object, AnalyticsPolicy.No);

            var result = controller.Index(new ResultsFilterViewModel{subjects = inputSubjectFilter}) as ViewResult;
            ViewDataDictionary viewData = result.ViewData;
            var resultsViewModel = (SubjectFilterViewModel) result.Model;

            Assert.That(resultsViewModel.FilterModel.SelectedSubjects, Is.EquivalentTo(expectedSelected));
            Assert.That(viewData["SubjectFilter"], Is.EqualTo(inputSubjectFilter));
        }
    }
}