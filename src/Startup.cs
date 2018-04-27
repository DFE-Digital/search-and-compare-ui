using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GovUk.Education.SearchAndCompare.Domain.Client;
using GovUk.Education.SearchAndCompare.Services.Http;
using GovUk.Education.SearchAndCompare.UI.ActionFilters;
using GovUk.Education.SearchAndCompare.UI.Services;
using GovUk.Education.SearchAndCompare.UI.Services.Http;
using GovUk.Education.SearchAndCompare.UI.Services.Maps;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            var apiUri = Environment.GetEnvironmentVariable("API_URI") ?? Configuration.GetSection("ApiConnection").GetValue<string>("Uri");
            services.AddScoped<ISearchAndCompareApi>(provider => new SearchAndCompareApi(new HttpClient(), apiUri));
            services.AddScoped<AnalyticsPolicy>(provider => AnalyticsPolicy.FromEnv());
            services.AddScoped<AnalyticsAttribute>();
            services.AddScoped<IGeocoder>(provider => new Geocoder(Configuration.GetSection("ApiKeys").GetValue<string>("GoogleMaps")));
            services.AddScoped<IMapProvider>(provider => new MapProvider(new HttpClientProvider(), Configuration.GetSection("ApiKeys").GetValue<string>("GoogleMapsStatic")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStaticFiles(new StaticFileOptions
                {
                    OnPrepareResponse = context => {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache");
                        context.Context.Response.Headers.Add("Expires", "-1");
                    }
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseStaticFiles();
            }

            app.AddContentLanguageHeaders("en");

            app.UseMvc(routes => {});
        }
    }
}
