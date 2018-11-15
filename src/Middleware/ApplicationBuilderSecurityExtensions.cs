using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Primitives;

namespace GovUk.Education.SearchAndCompare.UI.Middleware
{
    public static class ApplicationBuilderSecurityExtensions
    {
        public static IApplicationBuilder SetSecurityHeaders(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                context.Response.Headers["X-Frame-Options"] = new StringValues("SAMEORIGIN");
                context.Response.Headers["Strict-Transport-Security"] = new StringValues("max-age=31536000; includeSubDomains; preload");
                await next();
            });

            return app;
        }
    }
}
