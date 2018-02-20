using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Models;
using GovUk.Education.SearchAndCompare.UI.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.ViewModels;

namespace GovUk.Education.SearchAndCompare.UI.ViewFormatters
{
    public static class CourseExtensions
    {
        static string qts = "Qualified Teacher Status";

        static string pgce = "Postgraduate Certificate in Education";

        public static string FormattedOutcome(this Course course)
        {
            if (course.IncludesPgce == IncludesPgce.No)
            {
                return qts;
            }
            else if (course.IncludesPgce == IncludesPgce.Yes)
            {
                return pgce + " and " + qts;
            }
            return qts + " and optional " + pgce;
        }

        public static string FormattedDistance(this Course course)
        {
            return course.Distance != null
                ? string.Format("{0:0.#} miles", ((int) course.Distance / 1.60934 / 1000))
                : "Unknown";
        }

        public static IEnumerable<string> GetStudyTypes(this Course course) 
        {
            if (course.Campuses == null) yield break;

            if (course.Campuses.Any(x => x.FullTime == VacancyStatus.Vacancies))
            {
                yield return "Full time";
            }
            else if (course.Campuses.Any(x => x.FullTime == VacancyStatus.NoVacancies))
            {
                yield return "Full time (no vacancies)";
            }

            if (course.Campuses.Any(x => x.PartTime == VacancyStatus.Vacancies))
            {
                yield return "Part time";
            }
            else if (course.Campuses.Any(x => x.PartTime == VacancyStatus.NoVacancies))
            {
                yield return "Part time (no vacancies)";
            }
        }

        public static string FundingAvailable(this Course course)
        {
            return course.Subjects.Any(subject => subject.Funding != null) ? "Yes" : "No";
        }

        public static int GetNumberOfFullTimeVacancies(this Course course)
        {
            if (course.Campuses == null) return 0;

            return course.Campuses.Where(campus => campus.FullTime == VacancyStatus.Vacancies).Count();
        }

        public static int GetNumberOfPartTimeVacancies(this Course course)
        {
            if (course.Campuses == null) return 0;

            return course.Campuses.Where(campus => campus.PartTime == VacancyStatus.Vacancies).Count();
        }

        public static int GetNumberOfVacancies(this Course course)
        {
            return course.GetNumberOfFullTimeVacancies() + course.GetNumberOfPartTimeVacancies();
        }

        public static string GetNumberOfPlacementSchools(this Course course) 
        {
            return (course.Campuses == null || course.Campuses.Count < 2)
                ? "unknown" : (course.Campuses.Count - 1).ToString();
        }
    }
}
