﻿using System;
using System.Collections.Generic;
using System.Text;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public interface IFeatureFlags
    {
        bool Maps { get; }

        bool RedirectToRailsPageLocationWizard { get; }
        bool RedirectToRailsPageSubjectWizard { get; }
        bool RedirectToRailsPageSubject { get; }
        bool RedirectToRailsPageLocation { get; }
        bool RedirectToRailsPageFunding { get; }
        bool RedirectToRailsPageQualification { get; }
        bool RedirectToRailsPageStudyType { get; }
        bool RedirectToRailsPageVacancy { get; }
        bool RedirectToRailsPageProvider { get; }
        bool RedirectToRailsPageResults { get; }
        bool RedirectToRailsPageCourse { get; }
    }
}
