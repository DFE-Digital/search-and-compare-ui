using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.UI.Models;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SubjectFilterViewModel
    {
        public List<SubjectArea> SubjectAreas { get; set; }

        public ResultsFilterViewModel FilterModel { get; set; }
    }
}