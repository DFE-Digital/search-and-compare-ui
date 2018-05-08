using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SuggestedSearchViewModel
    {
        public IDictionary<RelevantType, RelevantResults> RelevantSearchResults { get; set; }
    }
    public class RelevantResults
    {
        public int TotalCourse { get; set; }
        public ResultsFilter RelevantResultFilter { get; set; }
    }
}
