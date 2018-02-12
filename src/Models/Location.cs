using System.ComponentModel.DataAnnotations.Schema;

namespace GovUk.Education.SearchAndCompare.UI.Models
{
    [Table("location")]
    public class Location
    {
        public int Id { get; set; }

        public string Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}