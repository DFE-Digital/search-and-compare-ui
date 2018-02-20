using System;
using Microsoft.AspNetCore.Builder;

namespace GovUk.Education.SearchAndCompare.UI
{
    public static class HeadersMiddleware
    {
        public static void AddContentLanguageHeaders(this IApplicationBuilder application, string language)
        {
            application.Use(async (ctx, next) => {
                ctx.Response.Headers.Add("Content-Language", String.IsNullOrEmpty(language) ? "en" : language);
                await next();
            });
        }
    }
}
