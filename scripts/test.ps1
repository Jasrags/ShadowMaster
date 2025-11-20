# PowerShell test script for Windows

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "Running tests..."

# Go tests
Write-ColorOutput Cyan "Running Go tests..."
go test -v ./...

# Frontend tests
Write-ColorOutput Cyan "Running frontend lint checks..."
Push-Location web\ui
if (-not (Test-Path "node_modules")) {
    npm install
}
npm run lint
Pop-Location

Write-ColorOutput Green "✓ All tests completed"

