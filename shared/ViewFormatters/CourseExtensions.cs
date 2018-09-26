using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Enums;

namespace GovUk.Education.SearchAndCompare.UI.Shared.ViewFormatters
{
    public static class CourseExtensions
    {
        static string qts = "Qualified teacher status";

        static string pgce = "Postgraduate certificate in education";

        private static Regex websiteRegex = new Regex("^https?:\\/\\/");

        public static string FormattedWebsite(this Course course)
        {
            var raw = course.ContactDetails?.Website;

            return string.IsNullOrEmpty(raw) ? null
                : websiteRegex.IsMatch(raw) ? raw
                : "http://" + raw;
        }

        public static string FormattedOutcome(this Course course)
        {
            if (course.IncludesPgce == IncludesPgce.No)
            {
                return qts;
            }
            else if (course.IncludesPgce == IncludesPgce.Yes)
            {
                return pgce + " with " + qts.ToLower();
            }
            return qts + " and optional " + pgce;
        }

        public static string FormattedDistance(this Course course)
        {
            return course.Distance != null
                ? string.Format("{0:#} miles", ((int) course.Distance / 1.60934 / 1000))
                : "Unknown";
        }

        public static bool IsUniversityLed(this Course course)
        {
            return course.Route.Id == 0;
        }

        public static string Duration(this Course course)
        {
            if (string.IsNullOrWhiteSpace(course.Duration))
            {
                return "unknown";
            }
            return course.Duration;
        }

        public static string FormattedStudyInfo(this Course course)
        {
            return string.Format("{0}, {1}",
            course.Duration(),
            string.Join(", ", course.GetStudyTypes()).ToLower());

            // course.IsUniversityLed() ? "university-led" : "school-led",
        }

        public static IEnumerable<string> GetStudyTypes(this Course course)
        {
            if (course.FullTime != VacancyStatus.NA)
            {
                yield return "Full time";
            }

            if (course.PartTime != VacancyStatus.NA)
            {
                yield return "Part time";
            }
        }

        public static string FormattedEarliestApplicationDate(this Course course)
        {
            var date = course.ApplicationsAcceptedFrom;

            if (!date.HasValue) { return string.Empty; }

            return date.Value.ToString("d MMMM yyyy", CultureInfo.CreateSpecificCulture("en-US"));
        }
        public static string FormattedStartDate(this Course course)
        {
            var date = course.StartDate;

            if (!date.HasValue) { return string.Empty; }

            // n.b. Ucas only specifies the month and year of the course start, so do not display
            // a day here.
            return date.Value.ToString("MMMM yyyy", CultureInfo.CreateSpecificCulture("en-US"));
        }

        public static string FundingOptions(this Course course)
        {
            if (course.Route.IsSalaried)
            {
                return "Salary";
            }
            else if (course.CourseSubjects.Any(cs => cs.Subject.Funding != null && cs.Subject.Funding.Scholarship != null)) {
                return "Scholarship, Bursary or Student finance if you’re eligible";
            }
            else if (course.CourseSubjects.Any(cs => cs.Subject.Funding != null))
            {
                return "Bursary or Student finance if you’re eligible";
            }
            else
            {
                return "Student finance if you’re eligible";
            }
        }

        public static int GetNumberOfFullTimeVacancies(this Course course)
        {
            return course.FullTime == VacancyStatus.Vacancies ? 1 : 0;
        }

        public static int GetNumberOfPartTimeVacancies(this Course course)
        {
            return course.PartTime == VacancyStatus.Vacancies ? 1 : 0;
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

        public static string VacanciesUiString(this Course course)
        {
            return course.FullTime == VacancyStatus.Vacancies || course.PartTime == VacancyStatus.Vacancies
                ? "Yes"
                : "No";
        }

        public static string StudyTypeUiString(this Course course)
        {
            var res = new List<string>();
            if (course.FullTime != VacancyStatus.NA) res.Add("Full time");
            if (course.PartTime != VacancyStatus.NA) res.Add("Part time");

            return string.Join(", ", res);
        }
    }
}
