using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("provider")]
    public class Provider
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string ProviderCode { get; set; }

        [InverseProperty("Provider")]
        public ICollection<Course> Courses { get; set; }
        
        [InverseProperty("AccreditingProvider")]
        public ICollection<Course> AccreditedCourses { get; set; }
    }
}