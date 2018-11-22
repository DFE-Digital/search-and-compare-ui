using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Services.Http;

namespace GovUk.Education.SearchAndCompare.Services
{
    public class GoogleAnalyticsClient
    {
        private IHttpClient httpClient;
        private string tid;

        public GoogleAnalyticsClient(IHttpClient httpClient, string tid)
        {
            this.httpClient = httpClient;
            this.tid = tid;
        }

        public async Task TrackEvent(string cid, string eventCategory, string eventAction, string eventLabel)
        {
            var payload = new FormUrlEncodedContent(new[] {
                KeyValuePair.Create("v", "1"),
                KeyValuePair.Create("tid", tid),
                KeyValuePair.Create("cid", cid),
                KeyValuePair.Create("t", "event"),
                KeyValuePair.Create("ec", eventCategory),
                KeyValuePair.Create("ea", eventAction),
                KeyValuePair.Create("el", eventLabel)
            });

            var payloadString = await payload.ReadAsStringAsync();

            var res = await httpClient.PostAsync(
                new System.Uri("https://www.google-analytics.com/collect"), 
                new StringContent(payloadString));
        }
    }
}