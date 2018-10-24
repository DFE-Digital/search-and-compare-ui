using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Controllers;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.Controllers
{
    [TestFixture]
    public class ResultsControllerTests
    {
        [Test]
        public void ReturnsNameAndLocation()
        {
            // arrange
            var apiMock = new Mock<ISearchAndCompareApi>();
            apiMock.Setup(a => a.GetSubjects()).Returns(new List<Subject>());
            const double latitude = 12.34;
            const double longitude = 56.78;
            const string courseName = "defence against the dark arts";
            var campus = new Campus
            {
                Location = new Location
                {
                    Latitude = latitude,
                    Longitude = longitude,
                },
            };
            var course = new Course
            {
                Name = courseName,
                Campuses = new List<Campus>
                {
                    campus,
                },
            };
            campus.Course = course;
            var paginatedList = new PaginatedList<Course>
            {
                Items = new List<Course>
                {
                    course,
                },
            };
            apiMock.Setup(a => a.GetCourses(It.IsAny<QueryFilter>())).Returns(paginatedList);
            var flagsMock = new Mock<IFeatureFlags>();
            var resultsController = new ResultsController(apiMock.Object, flagsMock.Object);
            var filter = new ResultsFilter();

            // act
            var actionResult = resultsController.ResultsMap(filter);

            // assert
            actionResult.Should().BeOfType<ViewResult>();
            var viewResult = (ViewResult)actionResult;
            var model = viewResult.Model;
            model.Should().BeOfType<ResultsViewModel>();
            var resultsModel = (ResultsViewModel)model;
            resultsModel.Should().NotBeNull();
            resultsModel.Map.Should().NotBeNull();
            resultsModel.Map.CourseGroups.Should().NotBeNull();
            var courseGroups = resultsModel.Map.CourseGroups.ToList();
            courseGroups.Should().HaveCount(1);
            var courseGroup = courseGroups.Single();
            courseGroup.Coordinates.Should().NotBeNull();
            courseGroup.Coordinates.Latitude.Should().Be(latitude);
            courseGroup.Coordinates.Longitude.Should().Be(longitude);
            courseGroup.Courses.Should().NotBeNull();
            courseGroup.Courses.Should().HaveCount(1);
            var returnedCourse = courseGroup.Courses.Single();
            returnedCourse.Should().NotBeNull();
            returnedCourse.Name.Should().Be(courseName);
        }
    }
}
