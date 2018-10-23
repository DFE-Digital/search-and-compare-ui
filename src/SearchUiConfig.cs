using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class SearchUiConfig
    {
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
                var apiUrl = _configuration["API_URL"];
                // remove trailing slash
                if (apiUrl.EndsWith("/"))
                {
                    apiUrl = apiUrl.Substring(0, apiUrl.Length - 1);
                }

                if (!apiUrl.EndsWith("/api"))
                {
                    apiUrl = apiUrl + "/api";
                }
                return apiUrl;
            }
        }
    }
}
