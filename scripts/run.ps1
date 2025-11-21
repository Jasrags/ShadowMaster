# PowerShell run script for Windows (alternative to Makefile)

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Check if binary exists
if (-not (Test-Path "bin\shadowmaster-server.exe")) {
    Write-ColorOutput Yellow "Binary not found. Building..."
    .\scripts\build.ps1
}

# Create data directory if it doesn't exist
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

Write-ColorOutput Cyan "Starting ShadowMaster server..."

$port = if ($args[0]) { $args[0] } else { "8080" }
$dataDir = if ($args[1]) { $args[1] } else { ".\data" }
$webDir = if ($args[2]) { $args[2] } else { ".\web\static" }

$env:SESSION_SECRET = if ($env:SESSION_SECRET) { $env:SESSION_SECRET } else { "change-me" }

& .\bin\shadowmaster-server.exe -port $port -data $dataDir -web $webDir

