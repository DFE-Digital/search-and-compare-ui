using System;

namespace GovUk.Education.SearchAndCompare.UI.Exceptions
{
    public class ExternalServiceException : Exception
    {
        public ExternalServiceException(string serviceName, string message) : base($"{serviceName}: {message}")
        {
        }

        public ExternalServiceException(string serviceName, string message, Exception exception) : base($"{serviceName}: {message}", exception)
        {
        }
    }
}
