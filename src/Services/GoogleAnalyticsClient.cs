using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Services.Http;

namespace GovUk.Education.SearchAndCompare.Services
{
    public class GoogleAnalyticsClient
    {
        private readonly AnalyticsPolicy analyticsPolicy;
        private HttpClient httpClient;
        private string tid;

        public GoogleAnalyticsClient(AnalyticsPolicy analyticsPolicy, HttpClient httpClient, string tid)
        {
            this.analyticsPolicy = analyticsPolicy;
            this.httpClient = httpClient;
            this.tid = "UA-112932657-1"; // to-do: don't hardcode
        }

        public async Task<int> TrackEvent(string cid, string eventCategory, string eventAction, string eventLabel)
        {
            if (analyticsPolicy == AnalyticsPolicy.No)
            {
                return 453;
            }

            var res = await httpClient.PostAsync("http://www.google-analytics.com/collect", new FormUrlEncodedContent(new[] {
                KeyValuePair.Create("v", "1"),
                KeyValuePair.Create("tid", tid),
                KeyValuePair.Create("cid", cid),
                KeyValuePair.Create("t", "event"),
                KeyValuePair.Create("ec", eventCategory),
                KeyValuePair.Create("ea", eventAction),
                KeyValuePair.Create("el", eventLabel)
            }));

            return (int)res.StatusCode;
        }
    }
}