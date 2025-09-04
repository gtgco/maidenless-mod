param(
  [string]$PathsFile = "config\paths.toml",
  [switch]$VerboseOutput
)

function Get-TomlValue {
  param([string]$Key)
  $line = (Get-Content $PathsFile | Where-Object { $_ -match "^\s*$Key\s*=" }) | Select-Object -First 1
  if (!$line) { return $null }
  return ($line -split "=",2)[1].Trim().Trim('"')
}

if (!(Test-Path $PathsFile)) {
  Write-Host "Please create config\paths.toml (copy from config\paths.example.toml) and set your tool paths." -ForegroundColor Yellow
  exit 1
}

$DarkScript3 = Get-TomlValue "DarkScript3Cli"
if (!(Test-Path $DarkScript3)) {
  Write-Host "DarkScript3Cli not found at: $DarkScript3" -ForegroundColor Red
  exit 1
}

function Check-DotNet6 {
  try { $runtimes = & dotnet --list-runtimes 2>$null } catch { return $false }
  foreach ($line in $runtimes) {
    if ($line -match "^Microsoft\.NETCore\.App\s+6\." -and $line -match "\(x64\)") { return $true }
  }
  return $false
}

New-Item -ItemType Directory -Force -Path event | Out-Null
$inFolder  = "script-src"
$outFolder = "event"

$ext = [System.IO.Path]::GetExtension($DarkScript3).ToLowerInvariant()
Write-Host "Compiling EVS from $inFolder → $outFolder ..." -ForegroundColor Cyan

$exitCode = 1
if ($ext -eq ".dll") {
  if (-not (Check-DotNet6)) {
    Write-Host "Missing .NET 6 x64 runtime. Install it, or run the DLL via the full 'dotnet.exe' path." -ForegroundColor Red
    exit 1
  }
  $argsA = @("/compile","`"$inFolder`"","`"$outFolder`"")
  if ($VerboseOutput) { Write-Host "dotnet `"$DarkScript3`" $($argsA -join ' ')" -ForegroundColor DarkGray }
  $p = Start-Process -FilePath "dotnet" -ArgumentList @("`"$DarkScript3`"") + $argsA -NoNewWindow -PassThru -Wait
  $exitCode = $p.ExitCode
}
elseif ($ext -eq ".exe") {
  try {
    $p = Start-Process -FilePath $DarkScript3 -ArgumentList @("/compile","`"$inFolder`"","`"$outFolder`"") -NoNewWindow -PassThru -Wait
    $exitCode = $p.ExitCode
  } catch { $exitCode = 1 }
}
else {
  Write-Host "Unsupported DarkScript3Cli extension: $ext (expected .exe or .dll)" -ForegroundColor Red
  exit 1
}

if ($exitCode -ne 0) {
  Write-Host "Compilation failed. If using DLL, confirm .NET 6 x64 runtime. If using EXE, try running it directly with /compile." -ForegroundColor Red
  exit $exitCode
}

Write-Host "Compilation complete. Check the 'event' folder." -ForegroundColor Green
