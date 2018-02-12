using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models.Joins
{
    [Table("course_subject")]
    public class CourseSubject
    {
        public int CourseId { get; set; }

        public Course Course { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }
    }
}
