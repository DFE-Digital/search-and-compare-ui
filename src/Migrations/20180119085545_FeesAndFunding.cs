using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SearchAndCompare.Migrations
{
    public partial class FeesAndFunding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FundingId",
                table: "subject",
                type: "int4",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSalaried",
                table: "route",
                type: "bool",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "fees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    EndYear = table.Column<int>(type: "int4", nullable: false),
                    EuFees = table.Column<long>(type: "int8", nullable: false),
                    InternationalFees = table.Column<long>(type: "int8", nullable: false),
                    StartYear = table.Column<int>(type: "int4", nullable: false),
                    UkFees = table.Column<long>(type: "int8", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "subject-funding",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int4", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    BursaryFirst = table.Column<int>(type: "int4", nullable: true),
                    BursaryLowerSecond = table.Column<int>(type: "int4", nullable: true),
                    BursaryUpperSecond = table.Column<int>(type: "int4", nullable: true),
                    EarlyCareerPayments = table.Column<int>(type: "int4", nullable: true),
                    Scholarship = table.Column<int>(type: "int4", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_subject-funding", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_subject_FundingId",
                table: "subject",
                column: "FundingId");

            migrationBuilder.AddForeignKey(
                name: "FK_subject_subject-funding_FundingId",
                table: "subject",
                column: "FundingId",
                principalTable: "subject-funding",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_subject_subject-funding_FundingId",
                table: "subject");

            migrationBuilder.DropTable(
                name: "fees");

            migrationBuilder.DropTable(
                name: "subject-funding");

            migrationBuilder.DropIndex(
                name: "IX_subject_FundingId",
                table: "subject");

            migrationBuilder.DropColumn(
                name: "FundingId",
                table: "subject");

            migrationBuilder.DropColumn(
                name: "IsSalaried",
                table: "route");
        }
    }
}
