using System;
using Microsoft.Extensions.Configuration;

namespace GovUk.Education.SearchAndCompare.UI
{
    public class EnvConfigConnectionStringBuilder {

        public string GetConnectionString(IConfiguration configuration)
        {
            var dbConfig = configuration.GetSection("DatabaseConnection");

            var server = Environment.GetEnvironmentVariable("POSTGRESQL_SERVICE_HOST") ?? dbConfig.GetValue<string>("Server");
            var port = Environment.GetEnvironmentVariable("POSTGRESQL_SERVICE_PORT") ?? dbConfig.GetValue<string>("Port");
            var user = Environment.GetEnvironmentVariable("PG_USERNAME") ?? dbConfig.GetValue<string>("Username");
            var pword = Environment.GetEnvironmentVariable("PG_PASSWORD") ?? dbConfig.GetValue<string>("Password");
            var dbase = Environment.GetEnvironmentVariable("PG_DATABASE") ?? dbConfig.GetValue<string>("Database");
            
            var sslDefault = "SSL Mode=Prefer;Trust Server Certificate=true";
            var ssl = Environment.GetEnvironmentVariable("PG_SSL") ?? dbConfig.GetValue<string>("Ssl") ?? sslDefault;

            var connectionString = $"Server={server};Port={port};Database={dbase};User Id={user};Password={pword};{ssl}";
            return connectionString;
        }
    }
}
