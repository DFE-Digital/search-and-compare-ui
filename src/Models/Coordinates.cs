namespace GovUk.Education.SearchAndCompare.UI.Models
{
    public class Coordinates 
    {        
        public double Latitude { get; }

        public double Longitude { get; }

        public string RawInput { get; }

        public string FormattedLocation { get; }

        public Coordinates(double latitude, double longitude, string rawInput, string formattedLocation)
        {
            Latitude = latitude;
            Longitude = longitude;
            RawInput = rawInput;
            FormattedLocation = formattedLocation;
        }
    }
}