using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using GovUk.Education.SearchAndCompare.UI.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.Models.Joins;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("course")]
    public class Course
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string ProgrammeCode { get; set; }

        public string ProviderCodeName { get; set; }

        public int ProviderId { get; set; }

        public Provider Provider { get; set; }

        public int? AccreditingProviderId { get; set; }

        public Provider AccreditingProvider { get; set; }

        public AgeRange AgeRange { get; set; }

        public int RouteId { get; set; }

        public Route Route { get; set; }

        public IncludesPgce IncludesPgce { get; set; }

        public ICollection<CourseDescriptionSection> DescriptionSections { get; set; }

        public ICollection<Campus> Campuses { get; set; }

        public ICollection<CourseSubject> CourseSubjects { get; set; }

        ///
        /// Convenience method equivalent to CourseSubjects.Select(x => x.Subject)
        ///
        [NotMapped]
        public IEnumerable<Subject> Subjects 
        {
            get
            {
                return CourseSubjects.Select(x => x.Subject);
            }
        }

        public int? ProviderLocationId { get; set; }

        public Location ProviderLocation { get; set; }

        public double? Distance { get; set; }
    }
}
