using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.ViewFormatters
{
    public static class LocationExtensions
    {
        public static Coordinates AsCoordinates(this Location location)
        {
            return new Coordinates(location.Latitude, location.Longitude);
        }
    }
}
