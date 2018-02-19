using System.Collections.Generic;
using GovUk.Education.SearchAndCompare.Domain.Filters;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class SubjectFilterViewModel
    {
        public List<SubjectArea> SubjectAreas { get; set; }

        public QueryFilter FilterModel { get; set; }
    }
}