using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters.Enums;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.ViewFormatters;
using GovUk.Education.SearchAndCompare.ViewModels;
using Microsoft.AspNetCore.Mvc;

using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class ResultsController : Controller
    {
        private readonly ISearchAndCompareApi api;
        private readonly IMapProvider mapProvider;

        public ResultsController(ISearchAndCompareApi api, IMapProvider mapProvider)
        {
            this.api = api;
            this.mapProvider = mapProvider;
        }

        [HttpPost("results/map")]
        public IActionResult Map(ResultsFilter filter)
        {
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        private static List<CourseGroup> GroupByProvider(PaginatedList<Course> courses)
        {
            return courses.Items.GroupBy(
                course => course.ProviderLocation.AsCoordinates(),
                course => course,
                (key, groupedCourses) => new CourseGroup
                {
                    Courses = groupedCourses.ToList(),
                    Coordinates = key
                }
            ).ToList();
        }

        [HttpGet("results/mapimage")]
        public async Task<IActionResult> MapImage(ResultsFilter filter)
        {
            var courses = api.GetCourses(filter.ToQueryFilter());
            var courseGroups = GroupByProvider(courses);

            var mapProjection = mapProvider.GetMapProjection<CourseGroup>(
                courseGroups, filter.Coordinates, 400, filter.zoomlevel);

            byte[] content = await mapProvider.GetStaticMapImageAsync(mapProjection);
            //return "data:image/png;base64," + Convert.ToBase64String(content);
            return File(content, "image/png");
        }

        [HttpGet("results")]
        public IActionResult Index(ResultsFilter filter)
        {
            var subjects = api.GetSubjects();
            filter.qualification = filter.qualification.Any() ? filter.qualification : new List<QualificationOption>{QualificationOption.QtsOnly, QualificationOption.PgdePgceWithQts, QualificationOption.Other};

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

            var mapsEnabled = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("FEATURE_MAPS"));

            PaginatedList<Course> courses;
            var queryFilter = filter.ToQueryFilter();

            var viewModel = new ResultsViewModel
            {
                Subjects = filteredSubjects,
                FilterModel = filter,
                MapsEnabled = mapsEnabled
            };

            if (mapsEnabled && filter.DisplayAsMap)
            {
                queryFilter.pageSize = 0;
                courses = api.GetCourses(queryFilter);
                var courseGroups = GroupByProvider(courses);

                var mapProjection = mapProvider.GetMapProjection<CourseGroup>(
                    courseGroups, filter.Coordinates, 400, filter.zoomlevel);

                viewModel.Map = new MapViewModel
                {
                    CourseGroups = mapProjection.MarkersWithAreas,
                    MyLocation = filter.Coordinates,
                    Map = mapProjection,
                    MapsApiKey = mapProvider.ApiKey
                };
                viewModel.Courses = courses;
            }
            else
            {
                queryFilter.pageSize = 10;

                viewModel.Courses = api.GetCourses(queryFilter);
            }

            return View(viewModel);
        }

        [HttpPost("results/sortby")]
        public IActionResult SortBy(ResultsFilter filter)
        {
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

    }
}
