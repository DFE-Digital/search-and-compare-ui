using System;
using System.Net.Http;
using System.Reflection;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Middleware;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using GovUk.Education.SearchAndCompare.UI.Shared.ViewComponents;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Serilog;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;
using GovUk.Education.SearchAndCompare.Services;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class Startup
    {
        private const string magicStringForGoogleAnalytics = "UA-112932657-1";

        private readonly Microsoft.Extensions.Logging.ILogger _logger;

        private readonly IHostingEnvironment _env;

        public Startup(IConfiguration configuration, ILoggerFactory logFactory, IHostingEnvironment env)
        {
            _logger = logFactory.CreateLogger<Startup>();
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));

            services.AddMemoryCache();

            var cookieSecurePolicy = _env.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;

            var sharedAssembly = typeof(CourseDetailsViewComponent).GetTypeInfo().Assembly;
            services.AddMvc(options =>
                options.Filters.Add(typeof(SearchAndCompareApiExceptionFilter))
            ).AddCookieTempDataProvider(options => {
                options.Cookie.SecurePolicy= cookieSecurePolicy;
            }).AddApplicationPart(sharedAssembly);

            services.AddAntiforgery(options => {
                options.Cookie.SecurePolicy = cookieSecurePolicy;
            });

            services.Configure<RazorViewEngineOptions>(o => o.FileProviders.Add(new EmbeddedFileProvider(sharedAssembly, "GovUk.Education.SearchAndCompare.UI.Shared")));

            services.AddSingleton<SearchUiConfig, SearchUiConfig>();

            // Handles 5XX, 408, and other errors "typical of HTTP calls".
            // Retries after specified intervals.
            var retryPolicy = HttpPolicyExtensions
                .HandleTransientHttpError()
                .Or<TimeoutRejectedException>() // thrown by Polly's TimeoutPolicy if the inner call times out
                .WaitAndRetryAsync(new[]
                {
                    TimeSpan.FromSeconds(1),
                    TimeSpan.FromSeconds(5),
                    TimeSpan.FromSeconds(10)
                });

            var INDIVIDUAL_REQUEST_TIMEOUT = 15;
            var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(INDIVIDUAL_REQUEST_TIMEOUT);

            services.AddHttpClient<IHttpClient, HttpClientWrapper>()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .AddPolicyHandler(retryPolicy)
                .AddPolicyHandler(timeoutPolicy);

            services.AddSingleton<ISearchAndCompareApi>(serviceProvider =>
            {
                var config = serviceProvider.GetService<SearchUiConfig>();
                var wrapper = serviceProvider.GetService<IHttpClient>();
                return new SearchAndCompareApi(wrapper, config.ApiUrl);
            });

            services.AddScoped<IFeatureFlags, FeatureFlags>();
            services.AddScoped<GoogleAnalyticsClient>(p => new GoogleAnalyticsClient(p.GetService<IHttpClient>(), magicStringForGoogleAnalytics));
            services.AddSingleton<IGeocoder>(provider => new Geocoder(Configuration["google_cloud_platform_key_geocoding"], new HttpClient()));
            services.AddSingleton<IRedirectUrlService, RedirectUrlService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider)
        {
            if (_env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
                app.UseStaticFiles(new StaticFileOptions
                {
                    OnPrepareResponse = context =>
                    {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache");
                        context.Context.Response.Headers.Add("Expires", "-1");
                    }
                });
            }
            else
            {
                app.UseStaticFiles();
                app.SetSecurityHeaders();
            }
            app.UseStatusCodePagesWithReExecute("/error/{0}");

            app.AddContentLanguageHeaders("en");

            var config = serviceProvider.GetService<SearchUiConfig>();
            config.Validate();
            _logger.LogInformation($"Using API base URL: {config.ApiUrl}");

            app.UseMvc(routes =>
            {
                routes.MapRoute("cookies", "cookies",
                    defaults: new { controller = "Legal", action = "Cookies" });
                routes.MapRoute("privacy", "privacy-policy",
                    defaults: new { controller = "Legal", action = "Privacy" });
                routes.MapRoute("tandc", "terms-conditions",
                    defaults: new { controller = "Legal", action = "TandC" });
                routes.MapRoute("sitemap", "sitemap.txt",
                    defaults: new { controller = "Sitemap", action = "Index" });
            });
        }
    }
}
