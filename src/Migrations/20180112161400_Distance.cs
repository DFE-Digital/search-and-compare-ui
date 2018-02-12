using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SearchAndCompare.Migrations
{
    public partial class Distance : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Distance",
                table: "course",
                type: "float8",
                nullable: true);

            migrationBuilder.Sql(@"
                CREATE OR REPLACE FUNCTION course_distance( lat DOUBLE PRECISION, 
                                                            lon DOUBLE PRECISION, 
                                                            rad DOUBLE PRECISION) 
                                            RETURNS TABLE ( ""Id"" integer,  
                                                            ""AccreditingProviderId"" integer, 
                                                            ""AgeRange"" integer, 
                                                            ""IncludesPgce"" integer, 
                                                            ""Name"" text, 
                                                            ""ProgrammeCode"" text, 
                                                            ""ProviderCodeName"" text, 
                                                            ""ProviderId"" integer, 
                                                            ""ProviderLocationId"" integer, 
                                                            ""RouteId"" integer,
                                                            ""Distance"" double precision) AS $$
                    SELECT course.""Id"",
                        course.""AccreditingProviderId"",
                        course.""AgeRange"",
                        course.""IncludesPgce"",
                        course.""Name"",
                        course.""ProgrammeCode"",
                        course.""ProviderCodeName"",
                        course.""ProviderId"",
                        course.""ProviderLocationId"",
                        course.""RouteId"",
                        earth_distance(ll_to_earth(lat, lon), ll_to_earth(""Latitude"",""Longitude"")) AS ""Distance""
                    FROM ""course""
                    JOIN location ON course.""ProviderLocationId"" = location.""Id""
                    WHERE ""earth_box""(ll_to_earth(lat, lon), rad) @> ll_to_earth(location.""Latitude"",location.""Longitude"") 
                    AND earth_distance(ll_to_earth(lat, lon), ll_to_earth(location.""Latitude"",location.""Longitude"")) <= rad
                $$ LANGUAGE SQL;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP FUNCTION course_distance");
            
            migrationBuilder.DropColumn(
                name: "Distance",
                table: "course");

            
        }
    }
}
