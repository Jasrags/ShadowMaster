# PowerShell run-dev script for Windows (equivalent to make run-dev)
# Runs both the API server and frontend dev server concurrently

$ErrorActionPreference = "Stop"

# Global variables for cleanup
$script:goServerProcess = $null
$script:tempScript = $null

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Cleanup function to stop all servers
function Stop-AllServers {
    Write-ColorOutput Yellow "`nCleaning up servers..."
    
    # Stop the Go server PowerShell window
    if ($script:goServerProcess -and -not $script:goServerProcess.HasExited) {
        Write-ColorOutput Yellow "Stopping Go server process..."
        Stop-Process -Id $script:goServerProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    # Kill any processes listening on port 8080 (Go server)
    $port8080Processes = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | 
        Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $port8080Processes) {
        if ($pid -gt 0) {
            Write-ColorOutput Yellow "Stopping process $pid on port 8080..."
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Kill any shadowmaster-server processes
    Get-Process -Name "shadowmaster-server" -ErrorAction SilentlyContinue | 
        Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Clean up temp script
    if ($script:tempScript -and (Test-Path $script:tempScript)) {
        Remove-Item $script:tempScript -ErrorAction SilentlyContinue
    }
    
    Write-ColorOutput Green "Cleanup complete."
}

# Set up trap for Ctrl+C and errors
trap {
    Stop-AllServers
    break
}

# Register cleanup handler for script exit
Register-EngineEvent PowerShell.Exiting -Action { Stop-AllServers } | Out-Null

Write-ColorOutput Cyan "Starting ShadowMaster in development mode..."
Write-ColorOutput Yellow "API server will run on port 8080"
Write-ColorOutput Yellow "Frontend dev server will run on port 5173"
Write-ColorOutput Yellow "Press Ctrl+C to stop both servers"
Write-Output ""

# Clean up any existing servers before starting
Write-ColorOutput Yellow "Checking for existing servers on port 8080..."
Stop-AllServers
Write-Output ""

# Create data directory if it doesn't exist
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

$port = if ($args[0]) { $args[0] } else { "8080" }
$dataDir = if ($args[1]) { $args[1] } else { ".\data" }
$webDir = if ($args[2]) { $args[2] } else { ".\web\static" }

$env:SESSION_SECRET = if ($env:SESSION_SECRET) { $env:SESSION_SECRET } else { "change-me" }

# Start the Go server in a separate window so logs are visible
Write-ColorOutput Cyan "Starting API server in a separate window..."
Write-ColorOutput Yellow "The Go server will run in a new PowerShell window where you can see all debug logs."
Write-Output ""

$projectRoot = Get-Location

# Build the Go server script
# Expand SESSION_SECRET in current context to pass value to spawned script
$sessionSecretValue = $env:SESSION_SECRET

$goServerScript = @"
Set-Location '$projectRoot'
`$env:SESSION_SECRET = '$sessionSecretValue'
Write-Host 'Starting Go API server on port $port...' -ForegroundColor Cyan
Write-Host ''
go run ./cmd/shadowmaster-server -port $port -data $dataDir -web $webDir
Write-Host ''
Write-Host 'Server stopped. Press any key to close this window...' -ForegroundColor Yellow
`$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@

# Create a temporary script file
$script:tempScript = [System.IO.Path]::GetTempFileName() + ".ps1"
$goServerScript | Out-File -FilePath $script:tempScript -Encoding UTF8

# Start the Go server in a new window
$script:goServerProcess = Start-Process powershell -ArgumentList "-NoExit", "-File", $script:tempScript -PassThru

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Start the frontend dev server in the foreground
Write-ColorOutput Cyan "Starting frontend dev server..."
Set-Location web/ui

try {
    # Check if node_modules exists, if not run npm install
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput Yellow "node_modules not found. Running npm install..."
        npm install
    }
    
    # Run the dev server (this will block until Ctrl+C)
    npm run dev
}
catch {
    Write-ColorOutput Red "Error: $_"
}
finally {
    # Cleanup: Stop all servers
    Stop-AllServers
    Set-Location ../..
}
