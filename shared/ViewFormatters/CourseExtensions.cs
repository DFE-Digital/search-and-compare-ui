using System;
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
        public const string FundingOption_Salary = "Salary";
        public const string FundingOption_Scholarship = "Scholarship, bursary or student finance if you’re eligible";
        public const string FundingOption_Bursary = "Bursary or student finance if you’re eligible";
        public const string FundingOption_StudentFinance = "Student finance if you’re eligible";

        private static Regex websiteRegex = new Regex("^https?:\\/\\/");

        public static string FormattedWebsite(this Course course)
        {
            var raw = course.ContactDetails?.Website;

            return string.IsNullOrEmpty(raw) ? null
                : websiteRegex.IsMatch(raw) ? raw
                : "http://" + raw;
        }

        public static string FormattedDistance(this double? distanceMetres)
        {
            if (distanceMetres == null)
            {
                return "Unknown";
            }

            const double kmPerMile = 1.60934;

            decimal distanceMiles = (decimal)( distanceMetres.Value / kmPerMile / 1000d);

            // most precision needed is 0.1 miles (round here to make the "==1" check behave
            distanceMiles = Math.Round(distanceMiles, 1);

            // only show decimal places if below a mile
            if (distanceMiles > 1)
            {
                distanceMiles = Math.Round(distanceMiles);
            }

            string formattedDistance = string.Format("{0:0.#} mile{1}", distanceMiles, distanceMiles == 1 ? "" : "s");

            return formattedDistance;
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

        public static bool HasScholarshipAndBursary(this Course course)
        {
            if (course.OverrideFunding())
            {
                return false;
            }
            return course.CourseSubjects.Any(cs => cs.Subject.Funding != null && cs.Subject.Funding.Scholarship != null);
        }

        public static bool HasBursary(this Course course)
        {
            if (course.OverrideFunding())
            {
                return false;
            }
            return course.CourseSubjects.Any(cs => cs.Subject.Funding != null);
        }

        /// <summary>
        /// Some of the course-subject combinations indicate there is funding,
        /// but that is for the second subject in "Foo with Bar" style courses
        /// and in that case there is not funding.
        /// We can't easily change the data model so until transition of course management
        /// to us is done we're overriding this here.
        /// </summary>
        /// <returns>true if funding information from course_subject should *not* apply</returns>
        private static bool OverrideFunding(this Course course)
        {
            if (!course.Name.Contains("with"))
            {
                // "Foo and Bar" courses are fine, it's just the "Foo with Bar" where we need to ignore Bar subject's funding info
                return false;
            }

            if (course.CourseSubjects.Count < 2)
            {
                // incorrect funding issue only shows up on multi-subject courses
                return false;
            }

            var problematicCoursePrefixes = new []
            {
                "Drama",
                "Media Studies",
                "PE",
                "Physical Education",
            };
            return problematicCoursePrefixes.Any(prefix =>
                course.Name.StartsWith(prefix, StringComparison.InvariantCultureIgnoreCase));
        }

        public static string FundingOptions(this Course course)
        {
            if (course.Route.IsSalaried)
            {
                return FundingOption_Salary;
            }
            else if (course.HasScholarshipAndBursary())
            {
                return FundingOption_Scholarship;
            }
            else if (course.HasBursary())
            {
                return FundingOption_Bursary;
            }
            else
            {
                return FundingOption_StudentFinance;
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
