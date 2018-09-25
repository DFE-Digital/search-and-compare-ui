using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class SearchConfig : ISearchConfig
    {
        private readonly IConfiguration _configuration;

        public SearchConfig(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool PreLaunchMode => !string.IsNullOrWhiteSpace(SitePassword);

        /// <summary>
        /// This will be set to prevent potential teachers seeing next year's course listings too early.
        /// The password will be shared with providers and the internal team to be able to preview and check the data before going live.
        /// Requires an app restart to take effect when set/cleared.
        /// </summary>
        public string SitePassword => _configuration["SITE_PASSWORD"];
    }
}
