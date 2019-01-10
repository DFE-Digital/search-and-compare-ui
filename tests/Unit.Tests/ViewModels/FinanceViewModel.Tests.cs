using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using GovUk.Education.SearchAndCompare.Domain.Models;
using GovUk.Education.SearchAndCompare.Domain.Models.Joins;
using GovUk.Education.SearchAndCompare.UI.ViewModels;
using NUnit.Framework;

namespace GovUk.Education.SearchAndCompare.UI.Unit.Tests.ViewModels
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

        [Test]
        [TestCase("Physics", "Biology")]
        [TestCase("Mathematics", "Biology")]
        [TestCase("Music", "Drama")]
        public void EarlyCareerPaymentsFlag_On_Course_With_Maths_Or_Physics_And_Null_Setting_Should_Be_False(string subject1, string subject2)
        {
            var subjects = new List<string> { subject1, subject2 };
            _subjectFunding.EarlyCareerPayments = null;
            _emptyCourse.CourseSubjects = SetupSUbjects(subjects, _subjectFunding);
            var sut = new GovUk.Education.SearchAndCompare.UI.Shared.ViewModels.FinanceViewModel(_emptyCourse, _feeCaps);
            sut.HasEarlyCareerPayments.Should().Be(false);
        }
        [Test]
        [TestCase("Physics", "Mathematics", "Frisby Aerodynamics")]
        [TestCase("Mathematics", "Physics", "Frisby Aerodynamics")]
        [TestCase("Frisby Aerodynamics", "Mathematics", "Physics")]
        [TestCase("Mathematics", "Frisby Aerodynamics", "Physics")]
        public void EarlyCareerPaymentsFlag_On_Course_Containing_Maths_And_Physics_And_Not_Null_Setting_Should_Be_False(string subject1, string subject2, string subject3)
        {
            var subjects = new List<string> { subject1, subject2, subject3 };
            _subjectFunding.EarlyCareerPayments = 1;
            _emptyCourse.CourseSubjects = SetupSUbjects(subjects, _subjectFunding);
            var sut = new GovUk.Education.SearchAndCompare.UI.Shared.ViewModels.FinanceViewModel(_emptyCourse, _feeCaps);
            sut.HasEarlyCareerPayments.Should().Be(false);
        }
        [Test]
        [TestCase("Physics", "Mathematics")]
        [TestCase("Mathematics", "Physics")]
        [TestCase("physics", "mathematics")]
        [TestCase("mathematics", "physics")]
        [TestCase("PHYSICS", "MATHEMATICS")]
        [TestCase("MATHEMATICS", "PHYSICS")]
        public void EarlyCareerPaymentsFlag_On_Course_With_Only_Maths_And_Physics_And_Not_Null_Setting_Should_Be_False(string subject1, string subject2)
        {
            var subjects = new List<string> {subject1, subject2};
            _subjectFunding.EarlyCareerPayments = 1;
            _emptyCourse.CourseSubjects = SetupSUbjects(subjects, _subjectFunding);
            var sut = new GovUk.Education.SearchAndCompare.UI.Shared.ViewModels.FinanceViewModel( _emptyCourse, _feeCaps);
            sut.HasEarlyCareerPayments.Should().Be(false);
        }
        [Test]
        [TestCase("Physics", "Biology")]
        [TestCase("Mathematics", "Biology")]
        [TestCase("Music", "Drama")]
        public void EarlyCareerPaymentsFlag_On_Course_With_Two_Subjects_And_Not_Null_Setting_Should_Be_True(string subject1, string subject2)
        {
            var subjects = new List<string> { subject1, subject2 };
            _subjectFunding.EarlyCareerPayments = 1;
            _emptyCourse.CourseSubjects = SetupSUbjects(subjects, _subjectFunding);
            var sut = new GovUk.Education.SearchAndCompare.UI.Shared.ViewModels.FinanceViewModel(_emptyCourse, _feeCaps);
            sut.HasEarlyCareerPayments.Should().Be(true);
        }
        [Test]
        [TestCase("Physics")]
        [TestCase("Mathematics")]
        [TestCase("Frisby Aerodynamics")]
        public void EarlyCareerPaymentsFlag_On_Course_With_One_Course_And_Not_Null_Setting_Should_Be_True(string subject)
        {
            var subjects = new List<string> {subject};
            _subjectFunding.EarlyCareerPayments = 1;
            _emptyCourse.CourseSubjects = SetupSUbjects(subjects, _subjectFunding);
            var sut = new GovUk.Education.SearchAndCompare.UI.Shared.ViewModels.FinanceViewModel(_emptyCourse, _feeCaps);
            sut.HasEarlyCareerPayments.Should().Be(true);
        }
        private static List<CourseSubject> SetupSUbjects(IEnumerable<string> subjects, SubjectFunding subjectFunding)
        {
            var subjectId = 1;

            return subjects.Select(subjectName => new CourseSubject
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
