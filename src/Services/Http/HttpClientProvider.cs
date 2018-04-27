using System.Net.Http;
using GovUk.Education.SearchAndCompare.UI.Services.Http;

namespace GovUk.Education.SearchAndCompare.Services.Http
{
    public class HttpClientProvider : IHttpClientProvider
    {
        public HttpClient GetHttpClient()
        {
            return new HttpClient();
        }
    }
}
