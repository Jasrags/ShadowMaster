# PowerShell build script for Windows (alternative to Makefile)

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "Building ShadowMaster..."

# Build frontend
Write-ColorOutput Cyan "Building frontend..."
Push-Location web\ui
npm run build
Pop-Location
Write-ColorOutput Green "✓ Frontend built"

# Build backend
Write-ColorOutput Cyan "Building server..."
if (-not (Test-Path "bin")) {
    New-Item -ItemType Directory -Path "bin" | Out-Null
}

$env:GOFLAGS = "-v"
$ldflags = "-s -w"
go build -ldflags $ldflags -o bin\shadowmaster-server.exe .\cmd\shadowmaster-server\

Write-ColorOutput Green "✓ Server built: bin\shadowmaster-server.exe"

