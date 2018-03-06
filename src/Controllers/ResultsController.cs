using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Services;
using Microsoft.AspNetCore.Mvc;
using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Filters;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.ViewFormatters;
using GovUk.Education.SearchAndCompare.UI.Services.Maps.Models;
using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.ViewModels;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    //[Authorize]
    public class ResultsController : CommonAttributesControllerBase
    {
        private readonly ISearchAndCompareApi api;
        private readonly IMapProvider mapProvider;

        public ResultsController(ISearchAndCompareApi api, IMapProvider mapProvider)
        {
            this.api = api;
            this.mapProvider = mapProvider;
        }

        [HttpPost("results/map")]
        public IActionResult Map(QueryFilter filter)
        {
            return RedirectToAction("Index", "Results", filter.ToRouteValues());
        }

        private static List<CourseGroup> GroupByProvider(PaginatedList<Course> courses)
        {
            return courses.Items.GroupBy(
                course => course.ProviderLocation.AsCoordinates(),
                course => course,
                (key, groupedCourses) => new CourseGroup {
                    Courses = groupedCourses.ToList(),
                    Coordinates = key
                }
            ).ToList();
        }

        [HttpGet("results/mapimage")]
        public async Task<IActionResult> MapImage(QueryFilter filter)
        {
            var courses = api.GetCourses(filter);
            var courseGroups = GroupByProvider(courses);

            var mapProjection = mapProvider.GetMapProjection<CourseGroup>(
                courseGroups, filter.Coordinates, 400, filter.zoomlevel);

            byte[] content = await mapProvider.GetStaticMapImageAsync(mapProjection);
            //return "data:image/png;base64," + Convert.ToBase64String(content);
            return File(content, "image/png");
        }

        [HttpGet("results")]
        public IActionResult Index(QueryFilter filter)
        {
            var courses = api.GetCourses(filter);

            var subjects = api.GetSubjects();

            FilteredList<Subject> filteredSubjects;
            if (filter.SelectedSubjects.Count > 0) {
                filteredSubjects = new FilteredList<Subject>(
                    subjects.Where(subject => filter.SelectedSubjects.Contains(subject.Id)).ToList(),
                    subjects.Count
                );
            } else {
                filteredSubjects = new FilteredList<Subject>(subjects, subjects.Count);
            }

            var viewModel = new ResultsViewModel {
                Subjects = filteredSubjects,
                FilterModel = filter,
                Courses = courses
            };

            if (filter.DisplayAsMap)
            {
                var courseGroups = GroupByProvider(courses);

                var mapProjection = mapProvider.GetMapProjection<CourseGroup>(
                    courseGroups, filter.Coordinates, 400, filter.zoomlevel);

                viewModel.Map = new MapViewModel {
                    CourseGroups = mapProjection.MarkersWithAreas,
                    MyLocation = filter.Coordinates,
                    Map = mapProjection,
                    MapsApiKey = mapProvider.ApiKey
                };
            }

            return View(viewModel);
        }

        [HttpPost("results/sortby")]
        public IActionResult SortBy(QueryFilter model)
        {
            return RedirectToAction("Index", "Results", model.ToRouteValues());
        }

    }
}
