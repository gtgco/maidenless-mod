param(
  [Parameter(Mandatory=$true)]
  [string]$Target
)

# Mirrors the event folder into a Mod Engine mod root (e.g., D:\Games\ModEngine2\mod\maidenless)
if (!(Test-Path "event\common.emevd.dcx")) {
  Write-Host "event\common.emevd.dcx not found. Run ./tools/pack.ps1 first." -ForegroundColor Red
  exit 1
}

New-Item -ItemType Directory -Force -Path (Join-Path $Target "event") | Out-Null
Copy-Item "event\common.emevd.dcx" (Join-Path $Target "event\common.emevd.dcx") -Force
Write-Host "Deployed to $Target" -ForegroundColor Green
