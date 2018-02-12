using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("course-description-section")]
    public class CourseDescriptionSection
    {
        public int Id { get; set; }

        public int Ordinal { get; set; }

        public string Name { get; set; }

        public string Text { get; set; }

        public int CourseId { get; set; }
        
        public Course Course { get; set; }
    }
}