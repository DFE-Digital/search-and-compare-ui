using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class ResultsViewModel
    {
        public PaginatedList<Course> Courses { get; set; }

        public FilterList<Subject> Subjects { get; set; }

        public ResultsFilterViewModel FilterModel { get; set; } = new ResultsFilterViewModel();   
    }
}
