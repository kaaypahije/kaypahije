param(
  [int]$Port = 5173,
  [string]$BindHost = "0.0.0.0"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmCmd = "C:\Program Files\nodejs\npm.cmd"
$viteJs = Join-Path $projectRoot "node_modules\vite\bin\vite.js"
$outLog = Join-Path $projectRoot "devserver.out.log"
$errLog = Join-Path $projectRoot "devserver.err.log"

if (-not (Test-Path $nodeExe)) {
  throw "Node was not found at '$nodeExe'. Install Node.js LTS and retry."
}

if (-not (Test-Path $viteJs)) {
  if (-not (Test-Path $npmCmd)) {
    throw "npm was not found at '$npmCmd'."
  }

  Write-Host "Installing dependencies..."
  & $npmCmd install --prefix $projectRoot
}

$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($existing) {
  Write-Host "A process is already listening on port $Port (PID $($existing.OwningProcess))."
  Write-Host "Open http://localhost:$Port/"
  exit 0
}

if (Test-Path $outLog) { Remove-Item $outLog -Force }
if (Test-Path $errLog) { Remove-Item $errLog -Force }

Start-Process `
  -FilePath $nodeExe `
  -ArgumentList "`"$viteJs`" dev --host $BindHost --port $Port" `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $outLog `
  -RedirectStandardError $errLog

Start-Sleep -Seconds 3

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  Write-Host "Dev server started."
  Write-Host "Local:   http://localhost:$Port/"
  Write-Host "Network: http://${BindHost}:$Port/"
  Write-Host "Logs:"
  Write-Host "  $outLog"
  Write-Host "  $errLog"
  Write-Host "PID: $($listener.OwningProcess)"
} else {
  Write-Host "Server did not start yet. Check logs:"
  Write-Host "  $outLog"
  Write-Host "  $errLog"
  exit 1
}
