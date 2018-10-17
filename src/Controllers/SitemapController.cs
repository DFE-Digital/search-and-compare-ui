using System;
using System.Text;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace GovUk.Education.SearchAndCompare.UI.Controllers
{
    public class SitemapController : Controller
    {
        public ISearchAndCompareApi _api;
        private readonly IMemoryCache _memoryCache;

        private const string _cacheKey = "sitemap.txt";

        public SitemapController(ISearchAndCompareApi api, IMemoryCache memoryCache)
        {
            _api = api;
            _memoryCache = memoryCache;
        }

        public IActionResult Index()
        {

            var res = _memoryCache.GetOrCreate(_cacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2);
                return GetSiteMapContents();
            });

            return Ok(res);
        }

        private string GetSiteMapContents()
        {
            var emptyQuery = new ResultsFilter().ToQueryFilter();
            emptyQuery.pageSize = 10_000_000;

            var allCourses = _api.GetCourses(emptyQuery).Items;

            var stringBuilder = new StringBuilder();

            foreach (var item in allCourses)
            {
                var action = Url.Action("Index", "Course", new { providerCode = item.Provider.ProviderCode, courseCode = item.ProgrammeCode }, Request.Scheme);
                stringBuilder.AppendLine(action);
            }

            return stringBuilder.ToString();
        }
    }
}
