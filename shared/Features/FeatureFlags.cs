using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Shared.Features
{
    public class FeatureFlags : IFeatureFlags
    {
        private readonly IConfiguration _config;

        private const string FEATURE_REDIRECT_TO_RAILS = "FEATURE_REDIRECT_TO_RAILS";

        public FeatureFlags(IConfiguration config)
        {
            _config = config;
        }

        public bool Maps => ShouldShow("FEATURE_MAPS");

        public bool RedirectToRailsPageLocationWizard => RedirectToRailsPage("LOCATIONWIZARD");
        public bool RedirectToRailsPageSubjectWizard => RedirectToRailsPage("SUBJECTWIZARD");
        public bool RedirectToRailsPageSubject => RedirectToRailsPage("SUBJECT");
        public bool RedirectToRailsPageLocation => RedirectToRailsPage("LOCATION");
        public bool RedirectToRailsPageFunding => RedirectToRailsPage("FUNDING");
        public bool RedirectToRailsPageQualification => RedirectToRailsPage("QUALIFICATION");
        public bool RedirectToRailsPageStudyType => RedirectToRailsPage("STUDYTYPE");
        public bool RedirectToRailsPageVacancy => RedirectToRailsPage("VACANCY");
        public bool RedirectToRailsPageCourse => RedirectToRailsPage("COURSE");

        public bool ShouldShow(string key)
        {
            var value = _config[key];
            return !string.IsNullOrWhiteSpace(value) && value.Trim().ToLower().Equals("true");
        }

        /// <summary>
        /// wizard pages
        ///
        /// /
        ///                 LOCATIONWIZARD
        /// /start/subject
        ///                 SUBJECTWIZARD
        ///
        ///
        /// filter pages
        ///
        /// /results/filter/
        ///                 SUBJECT
        ///                 LOCATION
        ///                 FUNDING
        ///                 QUALIFICATION
        ///                 STUDYTYPE
        ///                 VACANCY
        ///                 PROVIDER
        ///
        /// results page
        /// /results
        ///                 RESULTS
        /// course page
        /// /course
        ///                 COURSE
        /// </summary>
        private bool RedirectToRailsPage(string page) => ShouldShow($"{FEATURE_REDIRECT_TO_RAILS}_{page.ToUpperInvariant()}");
    }
}
