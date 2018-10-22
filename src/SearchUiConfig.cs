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

        public string ApiUrl => _configuration["API_URL"];
    }
}
