using System;
using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class FeesViewModel
    {
        public string Year { get; set; }

        public bool HasFees { get; set; }

        public long? UkFees { get; set; }

        public long? EuFees { get; set; }

        public long? InternationalFees { get; set; }

        public bool HasFunding { get; set; }

        public int? MaxScholarship { get; set; }

        public int? MaxBursary { get; set; }
        
        public bool IsSalaried { get; set; }

        public long? SalaryMin { get; set; }

        public long? SalaryMax { get; set; }

        public bool SalaryKnown {
            get 
            {
                return SalaryMin.HasValue || SalaryMax.HasValue;
            }
        }

        public static FeesViewModel FromCourseInfo(IEnumerable<Subject> subjects, Route route, Fees fees)
        {
            if (subjects == null)
            {
                throw new ArgumentNullException(nameof(subjects));
            }

            if (route == null)
            {
                throw new ArgumentNullException(nameof(route));
            }

            if (fees == null)
            {
                throw new ArgumentNullException(nameof(fees));
            }

            var year = fees.StartYear > 0 && fees.EndYear > fees.StartYear 
                ? string.Format($"{fees.StartYear}/{fees.EndYear}")
                : "this year";

            if (route.IsSalaried) 
            {
                return new FeesViewModel {
                    Year = year,
                    HasFees = false,
                    HasFunding = false,
                    IsSalaried = true
                };                
            } 
            else 
            {
                var maxScholarship = subjects.Any(x => x.Funding != null && x.Funding.Scholarship.HasValue)
                    ? (int?) subjects.Where(x => x.Funding != null && x.Funding.Scholarship.HasValue).Max(x => x.Funding.Scholarship.Value)
                    : null;

                var maxBursary = subjects.Any(x => x.Funding != null && x.Funding.BursaryFirst.HasValue)
                    ? (int?) subjects.Where(x => x.Funding != null && x.Funding.BursaryFirst.HasValue).Max(x => x.Funding.BursaryFirst.Value)
                    : null;
    
                return new FeesViewModel {
                    Year = year,
                    HasFees = fees.UkFees > 0 || fees.EuFees > 0 || fees.InternationalFees > 0,
                    UkFees = fees.UkFees > 0 ? (long?) fees.UkFees : null,
                    EuFees = fees.EuFees > 0 ? (long?) fees.EuFees : null,
                    InternationalFees = fees.InternationalFees > 0 ? (long?) fees.InternationalFees : null,

                    HasFunding = maxBursary.HasValue || maxScholarship.HasValue,
                    MaxScholarship = maxScholarship,
                    MaxBursary = maxBursary,

                    IsSalaried = false
                };
            }
        }
    }
}
