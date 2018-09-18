using GovUk.Education.SearchAndCompare.Domain.Models;

namespace GovUk.Education.SearchAndCompare.ViewFormatters
{
    public static class LocationExtensions
    {
        public static Coordinates AsCoordinates(this Location location)
        {
            if(location.Latitude.HasValue && location.Longitude.HasValue )
            {
                return new Coordinates(location.Latitude.Value, location.Longitude.Value);
            }
            else
            {
                return null;
            }
        }
    }
}
