using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SearchAndCompare.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "campus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Address = table.Column<string>(type: "text", nullable: true),
                    ApplicationsAcceptedFrom = table.Column<DateTime>(type: "timestamp", nullable: true),
                    CampusCode = table.Column<string>(type: "text", nullable: true),
                    FullTime = table.Column<int>(type: "int4", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    PartTime = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_campus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "default-course-description-section",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_default-course-description-section", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "location",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Latitude = table.Column<double>(type: "float8", nullable: false),
                    Longitude = table.Column<double>(type: "float8", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "provider",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    ProviderCode = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "route",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_route", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "subject-area",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Ordinal = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subject-area", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "course",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    AccreditingProviderId = table.Column<int>(type: "int4", nullable: true),
                    AgeRange = table.Column<int>(type: "int4", nullable: false),
                    IncludesPgce = table.Column<int>(type: "int4", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    ProgrammeCode = table.Column<string>(type: "text", nullable: true),
                    ProviderCodeName = table.Column<string>(type: "text", nullable: true),
                    ProviderId = table.Column<int>(type: "int4", nullable: false),
                    ProviderLocationId = table.Column<int>(type: "int4", nullable: true),
                    RouteId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course", x => x.Id);
                    table.ForeignKey(
                        name: "FK_course_provider_AccreditingProviderId",
                        column: x => x.AccreditingProviderId,
                        principalTable: "provider",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_provider_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "provider",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_course_location_ProviderLocationId",
                        column: x => x.ProviderLocationId,
                        principalTable: "location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_course_route_RouteId",
                        column: x => x.RouteId,
                        principalTable: "route",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "subject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    SubjectAreaId = table.Column<int>(type: "int4", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_subject_subject-area_SubjectAreaId",
                        column: x => x.SubjectAreaId,
                        principalTable: "subject-area",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "course_campus",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int4", nullable: false),
                    CampusId = table.Column<int>(type: "int4", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "course-description-section",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    CourseId = table.Column<int>(type: "int4", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Ordinal = table.Column<int>(type: "int4", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course-description-section", x => x.Id);
                    table.ForeignKey(
                        name: "FK_course-description-section_course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "course_subject",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int4", nullable: false),
                    SubjectId = table.Column<int>(type: "int4", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_course_subject", x => new { x.CourseId, x.SubjectId });
                    table.ForeignKey(
                        name: "FK_course_subject_course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_course_subject_subject_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "subject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_course_AccreditingProviderId",
                table: "course",
                column: "AccreditingProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_course_ProviderId",
                table: "course",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_course_ProviderLocationId",
                table: "course",
                column: "ProviderLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_course_RouteId",
                table: "course",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_course_campus_CampusId",
                table: "course_campus",
                column: "CampusId");

            migrationBuilder.CreateIndex(
                name: "IX_course_subject_SubjectId",
                table: "course_subject",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_course-description-section_CourseId",
                table: "course-description-section",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_subject_SubjectAreaId",
                table: "subject",
                column: "SubjectAreaId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "course_campus");

            migrationBuilder.DropTable(
                name: "course_subject");

            migrationBuilder.DropTable(
                name: "course-description-section");

            migrationBuilder.DropTable(
                name: "default-course-description-section");

            migrationBuilder.DropTable(
                name: "campus");

            migrationBuilder.DropTable(
                name: "subject");

            migrationBuilder.DropTable(
                name: "course");

            migrationBuilder.DropTable(
                name: "subject-area");

            migrationBuilder.DropTable(
                name: "provider");

            migrationBuilder.DropTable(
                name: "location");

            migrationBuilder.DropTable(
                name: "route");
        }
    }
}
