using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SuggestedSearchViewModel
    {
        public int TotalCount { get; set; }
        public ResultsFilter ResultsFilter { get; set; }
    }
}
