# Helper script to stop all ShadowMaster development servers
# Use this if servers don't stop properly after running run-dev.ps1

$ErrorActionPreference = "Continue"

Write-Host "Stopping ShadowMaster development servers..." -ForegroundColor Yellow

# Kill any processes listening on port 8080 (Go server)
$port8080Processes = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($processId in $port8080Processes) {
    if ($processId -gt 0) {
        Write-Host "Stopping process $processId on port 8080..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

# Kill any shadowmaster-server processes
$shadowmasterProcesses = Get-Process -Name "shadowmaster-server" -ErrorAction SilentlyContinue
if ($shadowmasterProcesses) {
    Write-Host "Stopping shadowmaster-server processes..." -ForegroundColor Yellow
    $shadowmasterProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
}

# Kill any Go processes (might be the go run command)
$goProcesses = Get-Process -Name "go" -ErrorAction SilentlyContinue
if ($goProcesses) {
    Write-Host "Stopping Go processes..." -ForegroundColor Yellow
    $goProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
}

# Wait a moment for processes to stop
Start-Sleep -Seconds 1

# Verify port 8080 is free
$remaining = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($remaining) {
    Write-Host "Warning: Port 8080 is still in use by:" -ForegroundColor Red
    $remaining | Format-Table LocalAddress, LocalPort, State, OwningProcess
} else {
    Write-Host "Port 8080 is now free." -ForegroundColor Green
}

# Verify no remaining processes
$remainingProcesses = Get-Process | Where-Object {$_.ProcessName -eq "go" -or $_.ProcessName -like "*shadowmaster*"}
if ($remainingProcesses) {
    Write-Host "Warning: Some processes are still running:" -ForegroundColor Red
    $remainingProcesses | Format-Table ProcessName, Id, StartTime
} else {
    Write-Host "All ShadowMaster processes stopped." -ForegroundColor Green
}

