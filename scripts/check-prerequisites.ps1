# Quick prerequisite check script for Windows

$ErrorActionPreference = "Continue"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-Command {
    param($Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

Write-ColorOutput Cyan "Checking prerequisites..."
Write-Output ""

$allOk = $true

# Check Go
if (Test-Command "go") {
    $goVersion = (go version) -split ' ' | Select-Object -Index 2
    Write-ColorOutput Green "[OK] Go $goVersion"
} else {
    Write-ColorOutput Red "[X] Go not found"
    $allOk = $false
}

# Check Node.js
$nodeFound = $false
if (Test-Command "node") {
    $nodeFound = $true
} else {
    # Check common installation locations
    $commonPaths = @(
        "C:\Program Files\nodejs\node.exe",
        "C:\Program Files (x86)\nodejs\node.exe",
        "$env:ProgramFiles\nodejs\node.exe",
        "$env:ProgramFiles(x86)\nodejs\node.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $nodeFound = $true
            break
        }
    }
}

if ($nodeFound) {
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-ColorOutput Green "[OK] Node.js $nodeVersion"
    } else {
        Write-ColorOutput Yellow "[!] Node.js found but not in PATH"
        Write-Output "  Add C:\Program Files\nodejs to your system PATH"
        $allOk = $false
    }
} else {
    Write-ColorOutput Red "[X] Node.js not found"
    $allOk = $false
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-ColorOutput Green "[OK] npm $npmVersion"
} else {
    Write-ColorOutput Red "[X] npm not found"
    $allOk = $false
}

# Check Make (optional)
if (Test-Command "make") {
    Write-ColorOutput Green "[OK] Make"
} elseif (Test-Command "wsl") {
    Write-ColorOutput Yellow "[!] Make not found (use WSL or PowerShell scripts)"
} else {
    Write-ColorOutput Yellow "[!] Make not found (optional)"
}

# Check Docker (optional)
if (Test-Command "docker") {
    try {
        docker info | Out-Null
        Write-ColorOutput Green "[OK] Docker (running)"
    } catch {
        Write-ColorOutput Yellow "[!] Docker (not running)"
    }
} else {
    Write-ColorOutput Yellow "[!] Docker not found (optional)"
}

Write-Output ""

if ($allOk) {
    Write-ColorOutput Green "All required prerequisites are installed!"
    exit 0
} else {
    Write-ColorOutput Red "Some required prerequisites are missing."
    Write-Output "Run .\scripts\setup.ps1 for installation instructions."
    exit 1
}

