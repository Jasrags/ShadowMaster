# ShadowMaster Setup Script for Windows
# This script checks prerequisites and sets up the development environment

$ErrorActionPreference = "Stop"

# Colors for output
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

Write-ColorOutput Cyan "ShadowMaster Setup Script"
Write-Output "================================"
Write-Output ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-ColorOutput Cyan "Checking prerequisites..."

# Check Go
if (-not (Test-Command "go")) {
    Write-ColorOutput Red "[X] Go is not installed"
    Write-Output "  Please install Go 1.21 or later from https://go.dev/dl/"
    exit 1
} else {
    $goVersionOutput = go version
    $goVersion = ($goVersionOutput -split ' ')[2] -replace 'go', ''
    $goVersionMajor = [int]($goVersion -split '\.')[0]
    $goVersionMinor = [int]($goVersion -split '\.')[1]
    
    if ($goVersionMajor -gt 1 -or ($goVersionMajor -eq 1 -and $goVersionMinor -ge 21)) {
        Write-ColorOutput Green "[OK] Go $goVersion installed"
    } else {
        Write-ColorOutput Yellow "[!] Go $goVersion installed, but 1.21+ is recommended"
    }
}

# Check Node.js
$nodeFound = $false
$nodePath = $null

# First check if node is in PATH
if (Test-Command "node") {
    $nodeFound = $true
    $nodePath = (Get-Command node).Source
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
            $nodePath = $path
            # Add to PATH for current session
            $env:Path = "$(Split-Path $path);$env:Path"
            Write-ColorOutput Yellow "[!] Node.js found at $path but not in PATH"
            Write-Output "  Added to PATH for this session. Consider adding to system PATH permanently."
            break
        }
    }
}

if (-not $nodeFound) {
    Write-ColorOutput Red "[X] Node.js is not installed or not found in PATH"
    Write-Output "  Please install Node.js 18+ from https://nodejs.org/"
    Write-Output "  Or add Node.js installation directory to your system PATH"
    Write-Output "  Common location: C:\Program Files\nodejs"
    exit 1
} else {
    $nodeVersion = (node --version) -replace 'v', ''
    $nodeMajor = [int]($nodeVersion -split '\.')[0]
    
    if ($nodeMajor -ge 18) {
        Write-ColorOutput Green "[OK] Node.js $nodeVersion installed"
        if ($nodePath -and -not (Test-Command "node")) {
            Write-ColorOutput Yellow "  Location: $nodePath"
        }
    } else {
        Write-ColorOutput Yellow "[!] Node.js $nodeVersion installed, but 18+ is recommended"
    }
}

# Check npm
if (-not (Test-Command "npm")) {
    # Check if npm exists in same directory as node
    if ($nodePath) {
        $npmPath = Join-Path (Split-Path $nodePath) "npm.cmd"
        if (Test-Path $npmPath) {
            $env:Path = "$(Split-Path $nodePath);$env:Path"
            Write-ColorOutput Yellow "[!] npm found but not in PATH. Added for this session."
        } else {
            Write-ColorOutput Red "[X] npm is not installed"
            Write-Output "  npm should come with Node.js. Please reinstall Node.js."
            exit 1
        }
    } else {
        Write-ColorOutput Red "[X] npm is not installed"
        Write-Output "  npm should come with Node.js. Please reinstall Node.js."
        exit 1
    }
}

if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-ColorOutput Green "[OK] npm $npmVersion installed"
} else {
    Write-ColorOutput Red "[X] npm is not accessible"
    Write-Output "  Please ensure Node.js installation directory is in your system PATH"
    exit 1
}

# Check Make (optional - check for WSL or suggest alternatives)
$hasMake = $false
if (Test-Command "make") {
    Write-ColorOutput Green "[OK] Make installed"
    $hasMake = $true
} elseif (Test-Command "wsl") {
    Write-ColorOutput Yellow "[!] Make not found in PowerShell"
    Write-Output "  You can use WSL (Windows Subsystem for Linux) for Make commands"
    Write-Output "  Or use the PowerShell scripts in scripts/ directory"
} else {
    Write-ColorOutput Yellow "[!] Make is not installed"
    Write-Output "  Options:"
    Write-Output "    1. Install WSL: wsl --install"
    Write-Output "    2. Use PowerShell scripts in scripts/ directory"
    Write-Output "    3. Install Make for Windows: https://www.gnu.org/software/make/"
}

# Check Docker (optional)
if (Test-Command "docker") {
    $dockerVersion = (docker --version) -split ' ' | Select-Object -Last 1
    Write-ColorOutput Green "[OK] Docker $dockerVersion installed"
    
    # Check if Docker daemon is running
    $dockerRunning = $false
    try {
        docker info | Out-Null
        $dockerRunning = $true
    } catch {
        $dockerRunning = $false
    }
    
    if ($dockerRunning) {
        Write-ColorOutput Green "[OK] Docker daemon is running"
    } else {
        Write-ColorOutput Yellow "[!] Docker is installed but daemon is not running"
        Write-Output "  Start Docker Desktop to use Docker commands"
    }
} else {
    Write-ColorOutput Yellow "[!] Docker is not installed (optional)"
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
Write-ColorOutput Green "[OK] Directories created"

# Install Go dependencies
Write-Output "Installing Go dependencies..."
go mod download
go mod tidy
Write-ColorOutput Green "[OK] Go dependencies installed"

# Install frontend dependencies
Write-Output "Installing frontend dependencies..."
Push-Location web\ui
if (-not (Test-Path "node_modules")) {
    npm install
    Write-ColorOutput Green "[OK] Frontend dependencies installed"
} else {
    Write-ColorOutput Green "[OK] Frontend dependencies already installed"
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
