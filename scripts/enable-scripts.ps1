# Helper script to enable PowerShell script execution
# Run this first if you get execution policy errors

Write-Host "PowerShell Execution Policy Helper" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check current policy
$currentPolicy = Get-ExecutionPolicy
Write-Host "Current execution policy: $currentPolicy" -ForegroundColor Yellow
Write-Host ""

# Show options
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Set RemoteSigned for CurrentUser (Recommended for development)"
Write-Host "2. Set Bypass for CurrentUser (Less secure, allows all scripts)"
Write-Host "3. Set RemoteSigned for Process only (Temporary, current session)"
Write-Host "4. Show current policy only"
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Setting execution policy to RemoteSigned for CurrentUser..." -ForegroundColor Yellow
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "[OK] Execution policy set to RemoteSigned" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now run PowerShell scripts in this project." -ForegroundColor Green
    }
    "2" {
        Write-Host "Setting execution policy to Bypass for CurrentUser..." -ForegroundColor Yellow
        Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
        Write-Host "[OK] Execution policy set to Bypass" -ForegroundColor Green
        Write-Host ""
        Write-Host "Warning: This allows all scripts to run without verification." -ForegroundColor Yellow
    }
    "3" {
        Write-Host "Setting execution policy to RemoteSigned for Process..." -ForegroundColor Yellow
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
        Write-Host "[OK] Execution policy set to RemoteSigned for this session" -ForegroundColor Green
        Write-Host ""
        Write-Host "Note: This only affects the current PowerShell session." -ForegroundColor Yellow
    }
    "4" {
        Write-Host "Current execution policies:" -ForegroundColor Cyan
        Get-ExecutionPolicy -List
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "You can now run:" -ForegroundColor Cyan
Write-Host "  .\scripts\setup.ps1" -ForegroundColor White
Write-Host "  .\scripts\build.ps1" -ForegroundColor White
Write-Host "  .\scripts\run.ps1" -ForegroundColor White

