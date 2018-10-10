using System;

namespace GovUk.Education.SearchAndCompare.UI.Exceptions
{
    public class GoogleMapsApiServiceException : ExternalServiceException
    {
        public GoogleMapsApiServiceException(string message) : base("Google Maps API", message)
        {
        }

        public GoogleMapsApiServiceException(string message, Exception exception) : base("Google Maps API", message, exception)
        {
        }
    }
}
