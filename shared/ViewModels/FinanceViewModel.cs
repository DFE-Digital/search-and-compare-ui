using System;
using System.Globalization;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.Shared.ViewModels
{
    public class FinanceViewModel
    {
        public Course Course { get; set; }

        public FeeCaps FeeCaps { get; set; }

        public bool IsSalaried => Course.IsSalaried;

        public string FormattedEuFees {
            get { return string.Format(CultureInfo.InvariantCulture, "£{0:n0}", Course.Fees.Eu); }
        }

        public string FormattedUkFees {
            get { return string.Format(CultureInfo.InvariantCulture, "£{0:n0}", Course.Fees.Uk); }
        }

        public string FormattedInternationalFees {
            get { return string.Format(CultureInfo.InvariantCulture, "£{0:n0}", Course.Fees.International); }
        }

        public string FormattedSalary {
            get
            {
                if (Course.Salary.Minimum.HasValue && Course.Salary.Maximum.HasValue)
                {
                    return string.Format(CultureInfo.InvariantCulture, "A salary of between £{0:n0} and £{1:n0} may be available depending on your experience.", Course.Salary.Minimum, Course.Salary.Maximum);
                }
                else if (Course.Salary.Minimum.HasValue)
                {
                    return string.Format(CultureInfo.InvariantCulture, "A salary of at least £{0:n0} may be available depending on your experience.", Course.Salary.Minimum);
                }
                else if (Course.Salary.Maximum.HasValue)
                {
                    return string.Format(CultureInfo.InvariantCulture, "A salary of up to £{0:n0} may be available depending on your experience.", Course.Salary.Maximum);
                }
                return "A salary may be available for this course depending on your experience.";
            }
        }

        public bool HasFunding {
            get { return MaxBursary.HasValue || MaxScholarship.HasValue; }
        }

        public string FormattedYear {
            get
            {
                return FeeCaps.StartYear > 0 && FeeCaps.EndYear > FeeCaps.StartYear
                        ? string.Format($"{FeeCaps.StartYear}/{FeeCaps.EndYear}")
                        : "this year";
            }
        }

        public int? MaxScholarship {
            get
            {
                return Course.CourseSubjects.Any(cs => cs.Subject.Funding != null && cs.Subject.Funding.Scholarship.HasValue)
                    ? (int?) Course.CourseSubjects.Where(cs => cs.Subject.Funding != null && cs.Subject.Funding.Scholarship.HasValue)
                                            .Max(cs => cs.Subject.Funding.Scholarship.Value)
                    : null;
            }
        }

        public bool HasEarlyCareerPayments
        {
            get
            {
                //do not apply when the course is tagged with both physics and mathematics.
                if (this.Course.CourseSubjects.Any(cs => cs.Subject.Name.Equals("Mathematics", StringComparison.InvariantCultureIgnoreCase))
                    && this.Course.CourseSubjects.Any(cs => cs.Subject.Name.Equals("Physics", StringComparison.InvariantCultureIgnoreCase)))
                {
                    return false;
                }

                return Course.CourseSubjects.Any(cs => cs.Subject.Funding?.EarlyCareerPayments != null);
            }
        }
        public string CurrencyMaxScholarship => String.Format(System.Globalization.CultureInfo.InvariantCulture, "£{0:n0}", MaxScholarship);
        public string FormattedMaxScholarship =>  $"Up to {CurrencyMaxScholarship} tax free scholarship while you train";

        public int? MaxBursary {
            get
            {
                return Course.CourseSubjects.Any(cs => cs.Subject.Funding != null && cs.Subject.Funding.BursaryFirst.HasValue)
                    ? (int?) Course.CourseSubjects.Where(cs => cs.Subject.Funding != null && cs.Subject.Funding.BursaryFirst.HasValue)
                                            .Max(cs => cs.Subject.Funding.BursaryFirst.Value)
                    : null;
            }
        }

        public string CurrencyMaxBursary => String.Format(System.Globalization.CultureInfo.InvariantCulture, "£{0:n0}", MaxBursary);

        public string FormattedMaxBursary =>  $"Up to {CurrencyMaxBursary} tax free bursary while you train";

        public FinanceViewModel(Course course, FeeCaps feeCaps)
        {
            if (course == null) { throw new ArgumentNullException(nameof(course)); }
            if (feeCaps == null) { throw new ArgumentNullException(nameof(feeCaps)); }

            Course = course;
            FeeCaps = feeCaps;
        }
    }
}
