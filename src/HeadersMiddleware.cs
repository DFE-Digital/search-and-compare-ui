using System.Linq;
using Microsoft.AspNetCore.Builder;

namespace GovUk.Education.SearchAndCompare.UI
{
    public static class HeadersMiddleware
    {
        public static void AddContentLanguageHeaders(this IApplicationBuilder application, string language)
        {
            application.Use(async (ctx, next) =>
            {
                var headers = ctx.Response.Headers;
                var languageToAdd = string.IsNullOrEmpty(language) ? "en" : language;
                // only add if missing to avoid a dupe key exception when re-execute is in use for http status code pages
                if (headers["Content-Language"].All(cl => cl != languageToAdd))
                {
                    headers.Add("Content-Language", languageToAdd);
                }
                await next();
            });
        }
    }
}
