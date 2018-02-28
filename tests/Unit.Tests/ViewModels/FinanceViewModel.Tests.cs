using System;
using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewModels
{
    [Category("FinanceViewModel")]
    public class FinanceViewModelTests
    {
        private FeeCaps _feeCaps = new FeeCaps {
            Id = 0,
            StartYear = 1990,
            EndYear = 2010,
            UkFees = 9001,
            EuFees = 9002,
            InternationalFees = 800000
        };

        private Course _emptyCourse = new Course ();

        private IEnumerable<Subject> MakeSubjects() => new List<Subject> {
            new Subject {
                Funding = new SubjectFunding {
                    Scholarship = 2,
                    BursaryFirst = 1                    
                }
            }
        };

        [Test]
        public void CtorThrowsWithNullCourse()
        {
            Assert.Throws(typeof(ArgumentNullException), () => new FinanceViewModel(null, _feeCaps)); 
        }

        [Test]
        public void CtorThrowsWithNullFeeCaps()
        {
            Assert.Throws(typeof(ArgumentNullException), () => new FinanceViewModel(_emptyCourse, null)); 
        }
    }
}