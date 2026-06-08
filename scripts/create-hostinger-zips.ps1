$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $repoRoot "deploy\hostinger"
$stageRoot = Join-Path $outputRoot "_stage"

function Reset-Directory {
  param([string]$Path)

  if (Test-Path $Path) {
    Remove-Item -LiteralPath $Path -Recurse -Force
  }

  New-Item -ItemType Directory -Path $Path | Out-Null
}

function Get-RelativePathSafe {
  param(
    [string]$BasePath,
    [string]$TargetPath
  )

  $baseUri = New-Object System.Uri(($BasePath.TrimEnd('\') + '\'))
  $targetUri = New-Object System.Uri($TargetPath)
  $relativeUri = $baseUri.MakeRelativeUri($targetUri)

  return [System.Uri]::UnescapeDataString($relativeUri.ToString()) -replace "/", "\"
}

function Copy-MatchedFiles {
  param(
    [string]$SourceRoot,
    [string]$TargetRoot,
    [string[]]$IncludePatterns,
    [string[]]$ExcludeSegments
  )

  foreach ($pattern in $IncludePatterns) {
    $resolvedPath = Join-Path $SourceRoot $pattern
    if (-not (Test-Path $resolvedPath)) {
      continue
    }

    $item = Get-Item -LiteralPath $resolvedPath -Force
    $itemsToCopy = @()

    if ($item.PSIsContainer) {
      $itemsToCopy = Get-ChildItem -LiteralPath $resolvedPath -Recurse -Force -File
    }
    else {
      $itemsToCopy = @($item)
    }

    foreach ($file in $itemsToCopy) {
      $relativePath = Get-RelativePathSafe -BasePath $SourceRoot -TargetPath $file.FullName
      $normalizedPath = $relativePath -replace "\\", "/"

      $isExcluded = $false
      foreach ($segment in $ExcludeSegments) {
        if ($normalizedPath -like $segment) {
          $isExcluded = $true
          break
        }
      }

      if ($isExcluded) {
        continue
      }

      $destinationPath = Join-Path $TargetRoot $relativePath
      $destinationDir = Split-Path -Parent $destinationPath
      if (-not (Test-Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
      }

      Copy-Item -LiteralPath $file.FullName -Destination $destinationPath -Force
    }
  }
}

Reset-Directory -Path $outputRoot
New-Item -ItemType Directory -Path $stageRoot | Out-Null

$frontendStage = Join-Path $stageRoot "frontend"
$backendStage = Join-Path $stageRoot "backend"

New-Item -ItemType Directory -Path $frontendStage | Out-Null
New-Item -ItemType Directory -Path $backendStage | Out-Null

$frontendIncludes = @(
  "src",
  "public",
  ".gitignore",
  ".prettierignore",
  ".prettierrc",
  "components.json",
  "eslint.config.js",
  "index.html",
  "package-lock.json",
  "package.json",
  "README.md",
  "tsconfig.json",
  "vite.config.ts"
)

$frontendExcludes = @(
  "node_modules/*",
  "dist/*",
  "deploy/*",
  "*.log",
  ".env",
  ".env.development"
)

Copy-MatchedFiles -SourceRoot $repoRoot -TargetRoot $frontendStage -IncludePatterns $frontendIncludes -ExcludeSegments $frontendExcludes

$backendRoot = Join-Path $repoRoot "backend"

$backendIncludes = @(
  "src",
  "scripts",
  ".env.example",
  "nodemon.json",
  "package-lock.json",
  "package.json"
)

$backendExcludes = @(
  "node_modules/*",
  "uploads/*",
  "*.log",
  ".env"
)

Copy-MatchedFiles -SourceRoot $backendRoot -TargetRoot $backendStage -IncludePatterns $backendIncludes -ExcludeSegments $backendExcludes

$frontendZip = Join-Path $outputRoot "frontend-source.zip"
$backendZip = Join-Path $outputRoot "backend-source.zip"

Compress-Archive -Path (Join-Path $frontendStage "*") -DestinationPath $frontendZip -CompressionLevel Optimal
Compress-Archive -Path (Join-Path $backendStage "*") -DestinationPath $backendZip -CompressionLevel Optimal

Remove-Item -LiteralPath $stageRoot -Recurse -Force

Write-Host "Created:"
Write-Host " - $frontendZip"
Write-Host " - $backendZip"
