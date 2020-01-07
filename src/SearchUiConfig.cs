using System;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class SearchUiConfig
    {
        private const string ConfigKeyApiUrl = "API_URL";
        private const string NewAppUrl = "NEW_APP_URL";

        private readonly IConfiguration _configuration;

        public SearchUiConfig(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Gets api url, trimming trailing slash and adding /api suffix if missing
        /// </summary>
        public string ApiUrl
        {
            get
            {
                var apiUrl = _configuration[ConfigKeyApiUrl];
                if (string.IsNullOrWhiteSpace(apiUrl))
                {
                    return apiUrl;
                }
                // remove trailing slash
                if (apiUrl.EndsWith("/"))
                {
                    apiUrl = apiUrl.Substring(0, apiUrl.Length - 1);
                }
                apiUrl = apiUrl + "/api";
                return apiUrl;
            }
        }

        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(ApiUrl))
            {
                throw new Exception($"Config value {ConfigKeyApiUrl} missing");
            }
        }
    }
}
