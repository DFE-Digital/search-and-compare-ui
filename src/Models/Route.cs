using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("route")]
    public class Route
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsSalaried { get; set; }

        public ICollection<Course> Courses { get; set; }
    }
}