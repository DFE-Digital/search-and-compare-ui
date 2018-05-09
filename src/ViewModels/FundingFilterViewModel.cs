using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class FundingFilterViewModel
    {
        public FundingFilterViewModel()
        {
            AllCount = 123;
            SalaryCount = 12;
        }
        public ResultsFilter FilterModel { get; set; }
        public int AllCount { get; set; }
        public int SalaryCount { get; set; }
    }
}