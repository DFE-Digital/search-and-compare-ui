using System.Net.Http;

namespace GovUk.Education.SearchAndCompare.UI.Services.Http
{
    public interface IHttpClientProvider
    {
        HttpClient GetHttpClient();
    }
}
