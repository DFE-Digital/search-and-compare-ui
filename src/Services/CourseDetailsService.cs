using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Shared.Services;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    /// <summary>
    ///     A simple wrapper around ISearchAndCompareApi for interface segregation
    /// </summary>    
    public class CourseDetailsService : ICourseDetailsService
    {
        private readonly ISearchAndCompareApi api;

        public CourseDetailsService(ISearchAndCompareApi api)
        {
            this.api = api;
        }

        public Course GetCourse(string providerCode, string courseCode)
        {
            return api.GetCourse(providerCode, courseCode);
        }

        public List<FeeCaps> GetFeeCaps()
        {
            return api.GetFeeCaps();
        }
    }
}