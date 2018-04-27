using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class LocationFilterViewModel
    {
        public ErrorViewModel Errors { get; set; } = ErrorViewModel.NewEmpty();

        public ResultsFilter FilterModel { get; set; }
    }
}
