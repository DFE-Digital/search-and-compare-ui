using System;
using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.ViewFormatters;
using GovUk.Education.SearchAndCompare.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class ResultsController : Controller
    {
        private readonly ISearchAndCompareApi _api;
        private readonly IFeatureFlags _featureFlags;

        public ResultsController(ISearchAndCompareApi api, IFeatureFlags featureFlags)
        {
            _api = api;
            _featureFlags = featureFlags;
        }

        [HttpPost("results/map")]
        public IActionResult Map(ResultsFilter filter)
        {
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        private static List<CourseGroup> GroupCoursesByCampusLocation(PaginatedList<Course> courses)
        {
            return courses.Items
                .SelectMany(c => c.Campuses)
                .GroupBy(
                    campus => campus.Location.AsCoordinates(),
                    campus => campus.Course,
                    (key, groupedCourses) => new CourseGroup
                    {
                        Coordinates = key,
                        Courses = groupedCourses.ToList(),
                    }
                ).ToList();
        }

        [HttpGet("results")]
        public IActionResult Index(ResultsFilter filter)
        {
            var subjects = _api.GetSubjects();
            if (subjects == null)
            {
                throw new Exception("Failed to retrieve subject list from api");
            }
            filter.qualification = filter.qualification.Any() ? filter.qualification : new List<QualificationOption> { QualificationOption.QtsOnly, QualificationOption.PgdePgceWithQts, QualificationOption.Other };

            FilteredList<Subject> filteredSubjects;
            if (filter.SelectedSubjects.Count > 0)
            {
                filteredSubjects = new FilteredList<Subject>(
                    subjects.Where(subject => filter.SelectedSubjects.Contains(subject.Id)).ToList(),
                    subjects.Count
                );
            }
            else
            {
                filteredSubjects = new FilteredList<Subject>(subjects, subjects.Count);
            }

            var mapsEnabled = _featureFlags.Maps;

            var queryFilter = filter.ToQueryFilter();

            var viewModel = new ResultsViewModel
            {
                Subjects = filteredSubjects,
                FilterModel = filter,
                MapsEnabled = mapsEnabled

            };

            queryFilter.pageSize = 10;

            viewModel.Courses = _api.GetCourses(queryFilter);

            return View(viewModel);
        }

        [HttpGet("resultsmap")]
        public IActionResult ResultsMap(ResultsFilter filter)
        {
            var subjects = _api.GetSubjects();
            filter.qualification = filter.qualification.Any() ? filter.qualification : new List<QualificationOption> { QualificationOption.QtsOnly, QualificationOption.PgdePgceWithQts, QualificationOption.Other };

            FilteredList<Subject> filteredSubjects;
            if (filter.SelectedSubjects.Count > 0)
            {
                filteredSubjects = new FilteredList<Subject>(
                    subjects.Where(subject => filter.SelectedSubjects.Contains(subject.Id)).ToList(),
                    subjects.Count
                );
            }
            else
            {
                filteredSubjects = new FilteredList<Subject>(subjects, subjects.Count);
            }

            var mapsEnabled = _featureFlags.Maps;

            PaginatedList<Course> courses;
            var queryFilter = filter.ToQueryFilter();

            var viewModel = new ResultsViewModel
            {
                Subjects = filteredSubjects,
                FilterModel = filter,
                MapsEnabled = mapsEnabled
            };

            queryFilter.pageSize = 0;
            courses = _api.GetCourses(queryFilter);
            var courseGroups = GroupCoursesByCampusLocation(courses);

            IMapProjection<CourseGroup> mapProjection = new MapProjection<CourseGroup>(courseGroups, filter.Coordinates, 400, filter.zoomlevel);

            viewModel.Map = new MapViewModel
            {
                CourseGroups = mapProjection.MarkersWithAreas,
                MyLocation = filter.Coordinates,
                Map = mapProjection,
            };
            viewModel.Courses = courses;

            return View(viewModel);
        }

        [HttpPost("results/sortby")]
        public IActionResult SortBy(ResultsFilter filter)
        {
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

    }
}
