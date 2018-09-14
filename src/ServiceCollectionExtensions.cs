using System.Security.Claims;
using System.Threading.Tasks;
using idunno.Authentication.Basic;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace GovUk.Education.SearchAndCompare.UI
{
    public static class ServiceCollectionExtensions
    {
        public static void AddBasicAuth(this IServiceCollection services, string sitePassword)
        {
            if (string.IsNullOrWhiteSpace(sitePassword))
            {
                return;
            }

            services.AddAuthentication(BasicAuthenticationDefaults.AuthenticationScheme)
                .AddBasic(options =>
                {
                    options.Events = new BasicAuthenticationEvents
                    {
                        OnValidateCredentials = context =>
                        {
                            if (context.Password != sitePassword)
                            {
                                return Task.CompletedTask;
                            }

                            var claims = new[]
                            {
                                new Claim(
                                    ClaimTypes.NameIdentifier,
                                    context.Username,
                                    ClaimValueTypes.String,
                                    context.Options.ClaimsIssuer),
                                new Claim(
                                    ClaimTypes.Name,
                                    context.Username,
                                    ClaimValueTypes.String,
                                    context.Options.ClaimsIssuer)
                            };

                            context.Principal = new ClaimsPrincipal(
                                new ClaimsIdentity(claims, context.Scheme.Name));
                            context.Success();

                            return Task.CompletedTask;
                        }
                    };
                    options.AllowInsecureProtocol = true; // only production has https
                });
        }
    }
}
