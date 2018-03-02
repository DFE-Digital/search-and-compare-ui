using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Enums;
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

        public static bool IsUniversityLed(this Course course)
        {
            return course.Route.Id == 0;
        }

        public static string Duration(this Course course)
        {
            bool fulltime = course.Campuses.Any(x => x.FullTime != VacancyStatus.NA);
            bool parttime = course.Campuses.Any(x => x.PartTime != VacancyStatus.NA);

            if (!fulltime)
            {
                return "18-24 months";
            }
            else if (!parttime)
            {
                return "1 year";
            }
            return "12-24 months";
        }

        public static string FormattedStudyInfo(this Course course)
        {
            return string.Format("{0}, {1}, {2}",
            course.Duration(),
            course.IsUniversityLed() ? "university-led" : "school-led",
            string.Join(",", course.GetStudyTypes()).ToLower());
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

        public static string FormattedEarliestApplicationDate(this Course course)
        {
            return course.Campuses.Select(campus => campus.ApplicationsAcceptedFrom).Min().Value.ToString("d MMMM yyyy", 
                  CultureInfo.CreateSpecificCulture("en-US"));
        }

        public static string FundingAvailable(this Course course)
        {
            return course.Route.IsSalaried || course.CourseSubjects.Any(cs => cs.Subject.Funding != null) ? "Yes" : "No";
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

        public static string HasVacancies(this Course course)
        {
            return course.GetNumberOfVacancies() != 0 ? "Yes" : "No";
        }

        public static string GetNumberOfPlacementSchools(this Course course)
        {
            return (course.Campuses == null || course.Campuses.Count < 2)
                ? "unknown" : (course.Campuses.Count - 1).ToString();
        }
    }
}
