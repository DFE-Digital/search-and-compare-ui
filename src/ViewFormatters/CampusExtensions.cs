using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.ViewModels;

namespace GovUk.Education.SearchAndCompare.UI.ViewFormatters
{
    public static class CampusExtensions
    {
        public static string VacanciesUiString(this Campus campus)
        {
            return campus.FullTime == VacancyStatus.Vacancies || campus.PartTime == VacancyStatus.Vacancies
                ? "Yes"
                : "No";
        }

        public static string StudyTypeUiString(this Campus campus)
        {
            var res = new List<string>();
            if (campus.FullTime != VacancyStatus.NA) res.Add("Full time"); 
            if (campus.PartTime != VacancyStatus.NA) res.Add("Part time");

            return string.Join(", ", res);
        }
    }
}