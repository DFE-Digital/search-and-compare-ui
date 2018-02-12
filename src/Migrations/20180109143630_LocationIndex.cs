using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SearchAndCompare.Migrations
{
    public partial class LocationIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // WARNING. THIS UP SCRIPT WORKS ON POSTGRES ONLY!!!!

            migrationBuilder.Sql(@"
                CREATE EXTENSION IF NOT EXISTS cube;
                CREATE EXTENSION IF NOT EXISTS earthdistance;
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX IX_location_Longitude_Latitude ON ""location"" USING gist (ll_to_earth(""Latitude"", ""Longitude""));
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_location_Longitude_Latitude",
                table: "location");
        }
    }
}
