using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EfcDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class otpfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TokenExpiry",
                table: "Users",
                newName: "OtpExpiry");

            migrationBuilder.RenameColumn(
                name: "ResetToken",
                table: "Users",
                newName: "ResetOtp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ResetOtp",
                table: "Users",
                newName: "ResetToken");

            migrationBuilder.RenameColumn(
                name: "OtpExpiry",
                table: "Users",
                newName: "TokenExpiry");
        }
    }
}
