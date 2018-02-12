using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using GovUk.Education.SearchAndCompare.UI.Models.Enums;
using GovUk.Education.SearchAndCompare.UI.Models.Joins;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("campus")]
    public class Campus
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string CampusCode { get; set; }

        public VacancyStatus FullTime { get; set; }

        public VacancyStatus PartTime { get; set; }

        public DateTime? ApplicationsAcceptedFrom { get; set; }

        public int? LocationId { get; set; }

        public Location Location { get; set; }

        public Course Course { get; set; }
    }
}