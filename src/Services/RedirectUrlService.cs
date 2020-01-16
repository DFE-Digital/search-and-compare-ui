using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class RedirectUrlService : IRedirectUrlService
    {
        private readonly string frontendBaseUrl;
        private readonly IConfiguration _configuration;

        public RedirectUrlService(IConfiguration configuration)
        {
            _configuration = configuration;
            frontendBaseUrl = _configuration["NEW_APP_URL"];
        }

        public RedirectResult RedirectToNewApp(string path)
        {
            return new RedirectResult(frontendBaseUrl + path);
        }
    }
}
