using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewFormatters;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewFormatters
{
    [TestFixture]
    public class CourseExtensionsTests_VacancyStrings
    {
        [Test]
        public void VacanciesUiString()
        {
            TestVacanciesString("No", MakeCourse(VacancyStatus.NA, VacancyStatus.NA));
            TestVacanciesString("No", MakeCourse(VacancyStatus.NA, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCourse(VacancyStatus.NA, VacancyStatus.Vacancies));

            TestVacanciesString("No", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.NA));
            TestVacanciesString("No", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.Vacancies));

            TestVacanciesString("Yes", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.NA));
            TestVacanciesString("Yes", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.Vacancies));
        }

        [Test]
        public void StudyTypeUiString()
        {
            TestStudyTypeString("", MakeCourse(VacancyStatus.NA, VacancyStatus.NA));
            TestStudyTypeString("Full time", MakeCourse(VacancyStatus.NA, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time", MakeCourse(VacancyStatus.NA, VacancyStatus.Vacancies));

            TestStudyTypeString("Part time", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.NA));
            TestStudyTypeString("Full time, Part time", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time, Part time", MakeCourse(VacancyStatus.NoVacancies, VacancyStatus.Vacancies));

            TestStudyTypeString("Part time", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.NA));
            TestStudyTypeString("Full time, Part time", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time, Part time", MakeCourse(VacancyStatus.Vacancies, VacancyStatus.Vacancies));
        }

        private static void TestVacanciesString(string expected, Course course)
        {
            Assert.That(course.VacanciesUiString(), Is.EqualTo(expected), $"Should be {expected} for {course.PartTime}, {course.FullTime}.");
        }

        private static void TestStudyTypeString(string expected, Course course)
        {
            Assert.That(course.StudyTypeUiString(), Is.EqualTo(expected), $"Should be {expected} for {course.PartTime}, {course.FullTime}.");
        }

        private static Course MakeCourse(VacancyStatus partTimeVacancyStatus, VacancyStatus fullTimeVacancyStatus)
        {
            return new Course
            {
                PartTime = partTimeVacancyStatus,
                FullTime = fullTimeVacancyStatus
            };
        }
    }
}
