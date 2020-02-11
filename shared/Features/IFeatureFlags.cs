using System;
using System.Collections.Generic;
using System.Text;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public interface IFeatureFlags
    {
        bool Maps { get; }

        bool RedirectToRailsPageSubjectWizard { get; }
        bool RedirectToRailsPageSubject { get; }
        bool RedirectToRailsPageLocation { get; }
        bool RedirectToRailsPageFunding { get; }
        bool RedirectToRailsPageQualification { get; }
        bool RedirectToRailsPageStudyType { get; }
        bool RedirectToRailsPageVacancy { get; }
        bool RedirectToRailsPageCourse { get; }
    }
}
