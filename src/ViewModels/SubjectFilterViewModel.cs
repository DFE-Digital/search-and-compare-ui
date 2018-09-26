using System.Collections.Generic;
using System.Globalization;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.Filters;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SubjectFilterViewModel
    {
        public List<SubjectArea> SubjectAreas { get; set; }

        public ResultsFilter FilterModel { get; set; }
    }
}
