using GovUk.Education.SearchAndCompare.Domain.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class LocationFilterViewModel
    {
        public ErrorViewModel Error { get; set; }

        public QueryFilter FilterModel { get; set; }
    }
}