using System;
using System.Collections.Generic;
using System.Linq;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewModels
{
    [Category("FeesViewModel")]
    public class FeesViewModelTests
    {        
        private Fees MakeFees() => new Fees {
            StartYear = 2000,
            EndYear = 2001,
            UkFees = 3,
            EuFees = 4,
            InternationalFees = 5
        };
        
        private IEnumerable<Subject> MakeSubjects() => new List<Subject> {
            new Subject {
                Funding = new SubjectFunding {
                    Scholarship = 2,
                    BursaryFirst = 1                    
                }
            }
        };

        [Test]
        public void HappyPathUnsalaried()
        {
            var r = FeesViewModel.FromCourseInfo(MakeSubjects(), new Route {IsSalaried = false}, MakeFees());

            Assert.That(r.Year, Is.EqualTo("2000/2001"));
            
            Assert.That(r.IsSalaried, Is.False);
            Assert.That(r.SalaryKnown, Is.False);
            Assert.That(r.SalaryMin, Is.Null);
            Assert.That(r.SalaryMax, Is.Null);
            
            Assert.That(r.HasFees, Is.True);
            Assert.That(r.UkFees, Is.EqualTo(3));
            Assert.That(r.EuFees, Is.EqualTo(4));
            Assert.That(r.InternationalFees, Is.EqualTo(5));

            Assert.That(r.HasFunding, Is.True);
            Assert.That(r.MaxScholarship, Is.EqualTo(2));
            Assert.That(r.MaxBursary, Is.EqualTo(1));
        }

        [Test]
        public void HappyPathSalaried()
        {
            var r = FeesViewModel.FromCourseInfo(MakeSubjects(), new Route {IsSalaried = true}, MakeFees());

            Assert.That(r.Year, Is.EqualTo("2000/2001"));
            
            Assert.That(r.IsSalaried, Is.True);
            Assert.That(r.SalaryKnown, Is.False);
            Assert.That(r.SalaryMin, Is.Null);
            Assert.That(r.SalaryMax, Is.Null);
            
            Assert.That(r.HasFees, Is.False);
            Assert.That(r.UkFees, Is.Null);
            Assert.That(r.EuFees, Is.Null);
            Assert.That(r.InternationalFees, Is.Null);

            Assert.That(r.HasFunding, Is.False);
            Assert.That(r.MaxScholarship, Is.Null);
            Assert.That(r.MaxBursary, Is.Null);
        }

        [Test]
        public void NullArgumnets()
        {
            Assert.Throws<ArgumentNullException>(() =>  FeesViewModel.FromCourseInfo(null, new Route {IsSalaried = true}, MakeFees()));
            Assert.Throws<ArgumentNullException>(() =>  FeesViewModel.FromCourseInfo(MakeSubjects(), null, MakeFees()));
            Assert.Throws<ArgumentNullException>(() =>  FeesViewModel.FromCourseInfo(MakeSubjects(), new Route {IsSalaried = true}, null));
        }

        [Test]
        public void DefaultObjects() 
        {
            var r = FeesViewModel.FromCourseInfo(new List<Subject>(), new Route(), new Fees());
            
            Assert.That(r.Year, Is.EqualTo("this year"));
            
            Assert.That(r.IsSalaried, Is.False);
            Assert.That(r.SalaryKnown, Is.False);
            Assert.That(r.SalaryMin, Is.Null);
            Assert.That(r.SalaryMax, Is.Null);
            
            Assert.That(r.HasFees, Is.False);
            Assert.That(r.UkFees, Is.Null);
            Assert.That(r.EuFees, Is.Null);
            Assert.That(r.InternationalFees, Is.Null);

            Assert.That(r.HasFunding, Is.False);
            Assert.That(r.MaxScholarship, Is.Null);
            Assert.That(r.MaxBursary, Is.Null);
        }

        [Test]
        public void NoFeesForEu()
        {
            var fees = MakeFees();
            fees.EuFees = 0;

            var r = FeesViewModel.FromCourseInfo(MakeSubjects(), new Route {IsSalaried = false}, fees);

            Assert.That(r.HasFees, Is.True);
            Assert.That(r.UkFees, Is.EqualTo(3));
            Assert.That(r.EuFees, Is.Null);
            Assert.That(r.InternationalFees, Is.EqualTo(5));
        }

        [Test]
        public void NoBursary()
        {
            var s = MakeSubjects().ToList();
            s[0].Funding.BursaryFirst = null;
            var r = FeesViewModel.FromCourseInfo(s, new Route {IsSalaried = false}, MakeFees());

            Assert.That(r.HasFunding, Is.True);
            Assert.That(r.MaxScholarship, Is.EqualTo(2));
            Assert.That(r.MaxBursary, Is.Null);
        }

        [Test]
        public void NoScholarship()
        {
            var s = MakeSubjects().ToList();
            s[0].Funding.Scholarship = null;
            var r = FeesViewModel.FromCourseInfo(s, new Route {IsSalaried = false}, MakeFees());

            Assert.That(r.HasFunding, Is.True);
            Assert.That(r.MaxScholarship, Is.Null);
            Assert.That(r.MaxBursary, Is.EqualTo(1));
        }
    }
}