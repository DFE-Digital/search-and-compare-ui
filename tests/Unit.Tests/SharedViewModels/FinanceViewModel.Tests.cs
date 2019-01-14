using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Joins;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewModels;
using NUnit.Framework;

namespace SearchAndCompareUI.Tests.Unit.Tests.SharedViewModels
{
    [Category("FinanceViewModel")]
    public class FinanceViewModelTests
    {
        private readonly FeeCaps _feeCaps = new FeeCaps {
            Id = 0,
            StartYear = 1990,
            EndYear = 2010,
            UkFees = 9001,
            EuFees = 9002,
            InternationalFees = 800000
        };

        private readonly Course _emptyCourse = new Course ();

        private readonly SubjectFunding _subjectFunding = new SubjectFunding
        {
            Scholarship = 2,
            BursaryFirst = 1
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


        /// <summary>
        /// This tests the new path and ensures early payments flag is set to false
        /// where there is a both physics and maths subjects and the early paymants flag
        /// subjects funding object set to a value or to null
        /// </summary>
        /// <param name="subjects">comma separated list of subjects</param>
        /// <param name="earlyPaymentsFlag">value for flag that normally sets the early payments</param>
        [Test]
        [TestCase("Physics,Mathematics", 1)]
        [TestCase("Mathematics,Physics", 1)]
        [TestCase("physics,mathematics", 1)]
        [TestCase("mathematics,physics", 1)]
        [TestCase("PHYSICS,MATHEMATICS", 1)]
        [TestCase("MATHEMATICS,PHYSICS", 1)]
        [TestCase("Physics,Mathematics", null)]
        [TestCase("Mathematics,Physics", null)]
        [TestCase("Physics,Mathematics,Frisby Aerodynamics", 1)]
        [TestCase("Frisby Aerodynamics,Mathematics,Physics", 1)]
        [TestCase("physics,Frisby Aerodynamics,mathematics", 1)]
        [TestCase("Physics,Mathematics,Frisby Aerodynamics", null)]
        [TestCase("Frisby Aerodynamics,Mathematics,Physics", null)]
        [TestCase("physics,Frisby Aerodynamics,mathematics", null)]
        [TestCase("music,drama", null)]//test edge cases
        [TestCase("music,drama,physics", null)]
        [TestCase("music,drama,mathematics", null)]
        public void EarlyCareerPaymentsFlag_On_Course_With_Maths_And_Physics_Should_Be_False(string subjects, int? earlyPaymentsFlag)
        {            
            _subjectFunding.EarlyCareerPayments = earlyPaymentsFlag;//here is the "not null" setting refered to in the name of the test
            _emptyCourse.CourseSubjects = SetupSubjects(subjects, _subjectFunding);
            var financeViewModel = new FinanceViewModel(_emptyCourse, _feeCaps);
            financeViewModel.HasEarlyCareerPayments.Should().Be(false);
        }

        /// <summary>
        /// This tests that the happy path still works ok
        /// </summary>
        /// <param name="subjects">comma separated list of subjects</param>
        /// <param name="earlyPaymentsFlag">value for flag that normally sets the early payments</param>
        [Test]
        [TestCase("Physics,Biology", 123)]
        [TestCase("Mathematics,Biology", 234)]
        [TestCase("Music,Drama", 345)]
        [TestCase("Physics", 345)]
        [TestCase("Mathematics", 345)]
        public void EarlyCareerPaymentsFlag_On_Course_With_Not_Null_Setting_Should_Be_True(string subjects, int? earlyPaymentsFlag)
        {
            _subjectFunding.EarlyCareerPayments = earlyPaymentsFlag;
            _emptyCourse.CourseSubjects = SetupSubjects(subjects, _subjectFunding);
            var financeViewModel = new FinanceViewModel(_emptyCourse, _feeCaps);
            financeViewModel.HasEarlyCareerPayments.Should().Be(true);
        }

        private static List<CourseSubject> SetupSubjects(string subjects, SubjectFunding subjectFunding)
        {
            var subjectId = 1;
            return subjects.Split(",").ToList().Select(subjectName => new CourseSubject
                {
                    SubjectId = subjectId++,
                    Subject = new Subject
                    {
                        Id = subjectId,
                        Name = subjectName,
                        FundingId = 1,
                        Funding = subjectFunding
                    }
                })
                .ToList();
        }
    }
}
