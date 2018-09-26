using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Filters;
using GovUk.Education.SearchAndCompare.UI.ViewModels.Enums;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SuggestedSearchesViewModel
    {
        public List<SuggestedSearchViewModel> SuggestedSearches { get; set; }
        public ResultsViewModel OriginalResults { get; set; }
        public bool HasSalary { get; internal set; }

        public string SelectedSubject {
            get { return OriginalResults.Subjects.Items.Count == 1 ? OriginalResults.Subjects.Items[0].Name : null; }
        }
    }
}
