using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("subject-area")]
    public class SubjectArea
    {
        public int Id { get; set; }

        public int Ordinal { get; set; }

        public string Name { get; set; }

        public ICollection<Subject> Subjects {get; set;}
    }
}