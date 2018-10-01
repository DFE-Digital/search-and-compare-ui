using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.Shared.Utils;
using Microsoft.AspNetCore.Html;

namespace GovUk.Education.SearchAndCompare.UI.Shared.ViewModels
{
    public class CourseDetailsViewModel
    {
        public string AboutYourOrgLink { get; set; }

        public bool PreviewMode { get; set; }

        public Course Course { get; set; }

        public FinanceViewModel Finance { get; set; }

        private MarkdownFormatter markdownFormatter = new MarkdownFormatter();

        public Provider Provider
        {
            get
            {
                return Course.Provider;
            }
        }

        public bool HasSection(string name)
        {
            return !string.IsNullOrWhiteSpace(
                Course.DescriptionSections.Where(x => x.Name == name).SingleOrDefault()?.Text);
        }

        public bool HasContactDetails()
        {
            return Course != null && Course.ContactDetails != null &&
                (!string.IsNullOrWhiteSpace(Course.ContactDetails.Email) ||
                    !string.IsNullOrWhiteSpace(Course.ContactDetails.Phone) ||
                    !string.IsNullOrWhiteSpace(Course.ContactDetails.Fax) ||
                    !string.IsNullOrWhiteSpace(Course.ContactDetails.Website) ||
                    HasAddress());
        }

        public bool HasAddress()
        {
            var a = Course;
            return Course != null && Course.ContactDetails != null &&
                !string.IsNullOrWhiteSpace(Course.ContactDetails.Address);
        }

        public bool HasFeesSet => Course?.Fees != null && (Finance?.FormattedUkFees != "£0");

        public bool HasWebsite => !string.IsNullOrEmpty(Course.ContactDetails.Website);

        public bool HasContentForAboutSection => HasSection(CourseDetailsSections.AboutTheCourse);

        public bool ShowMinimumAboutCourseSection => !HasContentForAboutSection && !PreviewMode && HasWebsite;

        public bool ShowWebsite => HasWebsite && !ShowMinimumAboutCourseSection;

        public HtmlString GetHtmlForSection(string name)
        {
            if (!HasSection(name))
            {
                return null;
            }

            return markdownFormatter.ToHtml(
                Course.DescriptionSections.Where(x => x.Name == name).SingleOrDefault()?.Text);
        }

        public IEnumerable<string> SubjectNames
        {
            get
            {
                return Course.CourseSubjects.Select(courseSubject => courseSubject.Subject.Name);
            }
        }

        public string FormattedSubjects
        {
            get
            {
                return string.Join(", ", SubjectNames.OrderBy(x => x));
            }
        }

        public string FormattedAgeRange
        {
            get
            {
                switch (Course.AgeRange)
                {
                    case (AgeRange.Primary):
                        {
                            return "Primary (c3 - 11/12 years)";
                        }
                    case (AgeRange.Secondary):
                        {
                            return "Secondary (12-17 years)";
                        }
                    default:
                        {
                            return "Unknown";
                        }
                }
            }
        }
    }
}
