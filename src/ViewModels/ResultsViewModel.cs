using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.ViewModels;
using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ResultsViewModel
    {
        public bool MapsEnabled { get; set; }

        public MapViewModel Map { get; set; }

        public PaginatedList<Course> Courses { get; set; }

        public FilteredList<Subject> Subjects { get; set; }

        public ResultsFilter FilterModel { get; set; } = new ResultsFilter();
    }
}
