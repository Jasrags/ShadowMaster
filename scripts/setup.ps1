# ShadowMaster Setup Script for Windows
# This script checks prerequisites and sets up the development environment

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "ShadowMaster Setup Script"
Write-Output "================================"
Write-Output ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to check version
function Test-Version {
    param(
        [string]$MinVersion,
        [string]$CurrentVersion
    )
    
    $min = [Version]$MinVersion
    $current = [Version]$CurrentVersion
    
    return $current -ge $min
}

# Check prerequisites
Write-ColorOutput Cyan "Checking prerequisites..."

# Check Go
if (-not (Test-Command "go")) {
    Write-ColorOutput Red "✗ Go is not installed"
    Write-Output "  Please install Go 1.21 or later from https://go.dev/dl/"
    exit 1
} else {
    $goVersionOutput = go version
    $goVersion = ($goVersionOutput -split ' ')[2] -replace 'go', ''
    $goVersionMajor = [int]($goVersion -split '\.')[0]
    $goVersionMinor = [int]($goVersion -split '\.')[1]
    
    if ($goVersionMajor -gt 1 -or ($goVersionMajor -eq 1 -and $goVersionMinor -ge 21)) {
        Write-ColorOutput Green "✓ Go $goVersion installed"
    } else {
        Write-ColorOutput Yellow "⚠ Go $goVersion installed, but 1.21+ is recommended"
    }
}

# Check Node.js
if (-not (Test-Command "node")) {
    Write-ColorOutput Red "✗ Node.js is not installed"
    Write-Output "  Please install Node.js 18+ from https://nodejs.org/"
    exit 1
} else {
    $nodeVersion = (node --version) -replace 'v', ''
    $nodeMajor = [int]($nodeVersion -split '\.')[0]
    
    if ($nodeMajor -ge 18) {
        Write-ColorOutput Green "✓ Node.js $nodeVersion installed"
    } else {
        Write-ColorOutput Yellow "⚠ Node.js $nodeVersion installed, but 18+ is recommended"
    }
}

# Check npm
if (-not (Test-Command "npm")) {
    Write-ColorOutput Red "✗ npm is not installed"
    Write-Output "  npm should come with Node.js. Please reinstall Node.js."
    exit 1
} else {
    $npmVersion = npm --version
    Write-ColorOutput Green "✓ npm $npmVersion installed"
}

# Check Make (optional - check for WSL or suggest alternatives)
$hasMake = $false
if (Test-Command "make") {
    Write-ColorOutput Green "✓ Make installed"
    $hasMake = $true
} elseif (Test-Command "wsl") {
    Write-ColorOutput Yellow "⚠ Make not found in PowerShell"
    Write-Output "  You can use WSL (Windows Subsystem for Linux) for Make commands"
    Write-Output "  Or use the PowerShell scripts in scripts/ directory"
} else {
    Write-ColorOutput Yellow "⚠ Make is not installed"
    Write-Output "  Options:"
    Write-Output "    1. Install WSL: wsl --install"
    Write-Output "    2. Use PowerShell scripts in scripts/ directory"
    Write-Output "    3. Install Make for Windows: https://www.gnu.org/software/make/"
}

# Check Docker (optional)
if (Test-Command "docker") {
    $dockerVersion = (docker --version) -split ' ' | Select-Object -Last 1
    Write-ColorOutput Green "✓ Docker $dockerVersion installed"
    
    # Check if Docker daemon is running
    try {
        docker info | Out-Null
        Write-ColorOutput Green "✓ Docker daemon is running"
    } catch {
        Write-ColorOutput Yellow "⚠ Docker is installed but daemon is not running"
        Write-Output "  Start Docker Desktop to use Docker commands"
    }
} else {
    Write-ColorOutput Yellow "⚠ Docker is not installed (optional)"
    Write-Output "  Install Docker Desktop for containerized deployment: https://docs.docker.com/desktop/install/windows-install/"
}

Write-Output ""
Write-ColorOutput Cyan "Setting up project..."

# Create necessary directories
Write-Output "Creating directories..."
$directories = @(
    "data\characters",
    "data\groups",
    "data\campaigns",
    "data\sessions",
    "data\scenes",
    "bin"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}
Write-ColorOutput Green "✓ Directories created"

# Install Go dependencies
Write-Output "Installing Go dependencies..."
go mod download
go mod tidy
Write-ColorOutput Green "✓ Go dependencies installed"

# Install frontend dependencies
Write-Output "Installing frontend dependencies..."
Push-Location web\ui
if (-not (Test-Path "node_modules")) {
    npm install
    Write-ColorOutput Green "✓ Frontend dependencies installed"
} else {
    Write-ColorOutput Green "✓ Frontend dependencies already installed"
}
Pop-Location

Write-Output ""
Write-ColorOutput Green "Setup complete!"
Write-Output ""
Write-Output "Next steps:"
if ($hasMake) {
    Write-Output "  1. Build the project: make build"
    Write-Output "  2. Run the server: make run"
} else {
    Write-Output "  1. Build the project: .\scripts\build.ps1"
    Write-Output "  2. Run the server: .\scripts\run.ps1"
}
Write-Output "  3. Access the app: http://localhost:8080"
Write-Output ""
Write-Output "For more information, see docs/getting-started/SETUP.md"

