# Amr Abdelfatah Mahmoud Abdelmonem

$ErrorActionPreference = "Stop"

$PyVersion   = "3.12.6"
$PyDir       = "C:\PyEnvs\Python312"
$PyExe       = Join-Path $PyDir "python.exe"
$InstallerUrl = "https://www.python.org/ftp/python/$PyVersion/python-$PyVersion-amd64.exe"
$InstallerPath = Join-Path $env:TEMP "python-$PyVersion-amd64.exe"

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = $ScriptDir

if (-not (Test-Path $PyExe)) {
    Write-Host "Downloading Python $PyVersion ..."
    Invoke-WebRequest -Uri $InstallerUrl -OutFile $InstallerPath

    Write-Host "Installing Python $PyVersion to $PyDir (isolated, no PATH changes) ..."
    Start-Process -FilePath $InstallerPath -ArgumentList @(
        "/quiet",
        "InstallAllUsers=0",
        "PrependPath=0",
        "Include_launcher=0",
        "Include_test=0",
        "TargetDir=$PyDir"
    ) -Wait

    Remove-Item $InstallerPath -ErrorAction SilentlyContinue
} else {
    Write-Host "Python $PyVersion already installed at $PyDir, skipping download."
}

if (-not (Test-Path $PyExe)) {
    throw "Python installation failed: $PyExe not found."
}

Write-Host "Using: $PyExe"
& $PyExe --version

$VenvDir = Join-Path $BackendDir ".venv"
if (Test-Path $VenvDir) {
    Write-Host "Removing existing .venv ..."
    Remove-Item -Recurse -Force $VenvDir
}

Write-Host "Creating virtual environment ..."
& $PyExe -m venv $VenvDir

$VenvPython = Join-Path $VenvDir "Scripts\python.exe"
$VenvPip    = Join-Path $VenvDir "Scripts\pip.exe"

Write-Host "Upgrading pip ..."
& $VenvPython -m pip install --upgrade pip

Write-Host "Installing backend requirements ..."
& $VenvPip install -r (Join-Path $BackendDir "requirements.txt")

$EnvExample = Join-Path $BackendDir ".env.example"
$EnvFile    = Join-Path $BackendDir ".env"
if ((Test-Path $EnvExample) -and (-not (Test-Path $EnvFile))) {
    Copy-Item $EnvExample $EnvFile
    Write-Host "Created .env from .env.example"
}

Write-Host ""
Write-Host "Setup complete. Starting the server ..."
Write-Host "Open http://localhost:8000/docs once it starts."
Write-Host ""

& $VenvPython -m uvicorn app.main:app --reload
