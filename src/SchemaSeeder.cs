using GovUk.Education.SearchAndCompare.UI.DatabaseAccess;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

namespace GovUk.Education.SearchAndCompare.UI
{
    public static class SchemaSeeder
    {
        public static void SeedSchema(this IApplicationBuilder app, CourseDbContext context)
        {
            context.Database.Migrate();
        }

        public static void test()
        {
        }
    }
}
