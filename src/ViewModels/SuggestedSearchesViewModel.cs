using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SuggestedSearchesViewModel
    {
        public List<SuggestedSearchViewModel> SuggestedSearches { get; set; }
        public ResultsViewModel OriginalResults { get; set; }
    }
}
