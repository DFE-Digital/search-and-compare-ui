namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class GeocodingResult
    {
        public double Latitude { get; }
        public double Longitude { get; }
        public string RawInput { get; }
        public string FormattedLocation { get; }
        public string Granularity { get; }
        public string Region { get; }

        public GeocodingResult(double lat, double lng, string rawInput, string formatted, string granularity, string region)
        {
            Latitude = lat;
            Longitude = lng;
            RawInput = rawInput;
            FormattedLocation = formatted;
            Granularity = granularity;
            Region = region;
        }
    }
}