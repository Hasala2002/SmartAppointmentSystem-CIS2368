# PowerShell script to copy schema.sql to API directory
# Run this before building if you encounter "schema.sql not found" errors

$sourceFile = "..\..\schema.sql"
$destinationFile = ".\schema.sql"

if (Test-Path $sourceFile) {
    Copy-Item -Path $sourceFile -Destination $destinationFile -Force
    Write-Host "✓ schema.sql copied successfully to apps/api/" -ForegroundColor Green
} else {
    Write-Host "✗ Error: schema.sql not found at $sourceFile" -ForegroundColor Red
    exit 1
}
