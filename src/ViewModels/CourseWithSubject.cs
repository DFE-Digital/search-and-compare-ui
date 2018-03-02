using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.UI.ViewModels
{
    public class CourseWithSubject
    {
        public Course Course { get; set; }

        public Subject Subject { get; set; }

        public CourseWithSubject(Course course, Subject subject)
        {
            this.Course = course;
            this.Subject = subject;
            string.IsNullOrEmpty("");
        }
    }
}
