using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.ViewFormatters;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewFormatters
{
    [TestFixture]
    public class CampusExtensionsTests
    {
        [Test]
        public void VacanciesUiString()
        {
            TestVacanciesString("No", MakeCampus(VacancyStatus.NA, VacancyStatus.NA));
            TestVacanciesString("No", MakeCampus(VacancyStatus.NA, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCampus(VacancyStatus.NA, VacancyStatus.Vacancies));

            TestVacanciesString("No", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.NA));
            TestVacanciesString("No", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.Vacancies));

            TestVacanciesString("Yes", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.NA));
            TestVacanciesString("Yes", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.NoVacancies));
            TestVacanciesString("Yes", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.Vacancies));
        }

        [Test]
        public void StudyTypeUiString()
        {
            TestStudyTypeString("", MakeCampus(VacancyStatus.NA, VacancyStatus.NA));
            TestStudyTypeString("Full time", MakeCampus(VacancyStatus.NA, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time", MakeCampus(VacancyStatus.NA, VacancyStatus.Vacancies));

            TestStudyTypeString("Part time", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.NA));
            TestStudyTypeString("Full time, Part time", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time, Part time", MakeCampus(VacancyStatus.NoVacancies, VacancyStatus.Vacancies));

            TestStudyTypeString("Part time", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.NA));
            TestStudyTypeString("Full time, Part time", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.NoVacancies));
            TestStudyTypeString("Full time, Part time", MakeCampus(VacancyStatus.Vacancies, VacancyStatus.Vacancies));
        }

        private static void TestVacanciesString(string expected, Campus campus)
        {
            Assert.That(campus.VacanciesUiString(), Is.EqualTo(expected), $"Should be {expected} for {campus.PartTime}, {campus.FullTime}.");
        }

        private static void TestStudyTypeString(string expected, Campus campus)
        {
            Assert.That(campus.StudyTypeUiString(), Is.EqualTo(expected), $"Should be {expected} for {campus.PartTime}, {campus.FullTime}.");
        }

        private static Campus MakeCampus(VacancyStatus partTimeVacancyStatus, VacancyStatus fullTimeVacancyStatus)
        {
            return new Campus 
            {
                PartTime = partTimeVacancyStatus,
                FullTime = fullTimeVacancyStatus
            };
        }
    }
}