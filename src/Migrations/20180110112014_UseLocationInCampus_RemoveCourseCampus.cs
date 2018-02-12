using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SearchAndCompare.Migrations
{
    public partial class UseLocationInCampus_RemoveCourseCampus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "course_campus");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "campus");

            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "campus",
                type: "int4",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "campus",
                type: "int4",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_campus_CourseId",
                table: "campus",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_campus_LocationId",
                table: "campus",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_campus_course_CourseId",
                table: "campus",
                column: "CourseId",
                principalTable: "course",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_campus_location_LocationId",
                table: "campus",
                column: "LocationId",
                principalTable: "location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_campus_course_CourseId",
                table: "campus");

            migrationBuilder.DropForeignKey(
                name: "FK_campus_location_LocationId",
                table: "campus");

            migrationBuilder.DropIndex(
                name: "IX_campus_CourseId",
                table: "campus");

            migrationBuilder.DropIndex(
                name: "IX_campus_LocationId",
                table: "campus");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "campus");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "campus");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "campus",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "course_campus",
                columns: table => new
                {
                    CourseId = table.Column<int>(nullable: false),
                    CampusId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_campus", x => new { x.CourseId, x.CampusId });
                    table.ForeignKey(
                        name: "FK_course_campus_campus_CampusId",
                        column: x => x.CampusId,
                        principalTable: "campus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_course_campus_course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_course_campus_CampusId",
                table: "course_campus",
                column: "CampusId");
        }
    }
}
