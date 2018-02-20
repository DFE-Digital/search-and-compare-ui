using GovUk.Education.SearchAndCompare.Domain.Lists;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ResultsViewModel
    {
        public PaginatedList<Course> Courses { get; set; }

        public FilteredList<Subject> Subjects { get; set; }

        public QueryFilter FilterModel { get; set; } = new QueryFilter();   
    }
}
