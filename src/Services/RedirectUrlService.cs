using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System;

namespace GovUk.Education.SearchAndCompare.UI.Services
{
    public class RedirectUrlService : IRedirectUrlService
    {
        private readonly string frontendBaseUrl;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RedirectUrlService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            frontendBaseUrl = _configuration["NEW_APP_URL"];
            _httpContextAccessor = httpContextAccessor;

        }

        public RedirectResult RedirectToNewApp(string path)
        {
            var uriBuilder = new UriBuilder(frontendBaseUrl);
            uriBuilder.Path = path;

            return new RedirectResult(uriBuilder.ToString());
        }

        public RedirectResult RedirectToNewApp()
        {
            var uriBuilder = new UriBuilder(frontendBaseUrl);
            uriBuilder.Path = _httpContextAccessor.HttpContext.Request.Path;
            uriBuilder.Query = _httpContextAccessor.HttpContext.Request.QueryString.ToString();

            return new RedirectResult(uriBuilder.ToString());
        }
    }
}
