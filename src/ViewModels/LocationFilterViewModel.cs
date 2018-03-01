using GovUk.Education.SearchAndCompare.Domain.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class LocationFilterViewModel
    {
        public string Error { get; set; }

        public QueryFilter FilterModel { get; set; }
    }
}