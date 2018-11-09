﻿using System;
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
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Serilog;
using GovUk.Education.SearchAndCompare.UI.Shared.Features;


namespace GovUk.Education.SearchAndCompare.UI
{
    public class Startup
    {
        private readonly Microsoft.Extensions.Logging.ILogger _logger;

        public Startup(IConfiguration configuration, ILoggerFactory logFactory)
        {
            _logger = logFactory.CreateLogger<Startup>();
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));

            services.AddMemoryCache();

            var sharedAssembly = typeof(CourseDetailsViewComponent).GetTypeInfo().Assembly;
            services.AddMvc(options =>
                options.Filters.Add(typeof(SearchAndCompareApiExceptionFilter))
            ).AddApplicationPart(sharedAssembly);

            services.Configure<RazorViewEngineOptions>(o => o.FileProviders.Add(new EmbeddedFileProvider(sharedAssembly, "GovUk.Education.SearchAndCompare.UI.Shared")));

            services.AddSingleton<SearchUiConfig, SearchUiConfig>();

            var REQUEST_TIMEOUT = 15;
            services.AddHttpClient<IHttpClient, HttpClientWrapper>(x => x.Timeout = TimeSpan.FromSeconds(REQUEST_TIMEOUT))
                 .SetHandlerLifetime(TimeSpan.FromMinutes(5));

            services.AddSingleton<ISearchAndCompareApi>(serviceProvider =>
            {
                var config = serviceProvider.GetService<SearchUiConfig>();
                var wrapper = serviceProvider.GetService<IHttpClient>();
                return new SearchAndCompareApi(wrapper, config.ApiUrl);
            });

            services.AddScoped<IFeatureFlags, FeatureFlags>();
            services.AddSingleton<IGeocoder>(provider => new Geocoder(Configuration["google_cloud_platform_key_geocoding"], new HttpClient()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
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
