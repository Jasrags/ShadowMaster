# PowerShell build script for Windows (alternative to Makefile)

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true, Position=0)]
        [ConsoleColor]$ForegroundColor,
        [Parameter(Mandatory=$true, Position=1)]
        [string]$Message
    )
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "Building ShadowMaster..."

# Build frontend
Write-ColorOutput Cyan "Building frontend..."
Push-Location web\ui
npm run build
Pop-Location
Write-ColorOutput Green "[OK] Frontend built"

# Build backend
Write-ColorOutput Cyan "Building server..."
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

$env:GOFLAGS = "-v"
$ldflags = "-s -w"
go build -ldflags $ldflags -o bin\shadowmaster-server.exe .\cmd\shadowmaster-server\

Write-ColorOutput Green "[OK] Server built: bin\shadowmaster-server.exe"

