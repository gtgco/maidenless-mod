param(
  [string]$PathsFile = "config\paths.toml"
)

function Get-TomlValue {
  param([string]$Key)
  $line = (Get-Content $PathsFile | Where-Object { $_ -match "^\s*$Key\s*=" }) | Select-Object -First 1
  if (!$line) { return $null }
  return ($line -split "=",2)[1].Trim().Trim('"')
}

$Witchy = Get-TomlValue "WitchyBND"
$Yabber = Get-TomlValue "Yabber"

$targetIn  = "event\common.emevd"
$targetOut = "event\common.emevd.dcx"

if (!(Test-Path $targetIn)) {
  Write-Host "Input not found: $targetIn (compile first)" -ForegroundColor Red
  exit 1
}

if (Test-Path $Witchy) {
  Write-Host "Open WitchyBND and pack:" -ForegroundColor Cyan
  Write-Host "  $targetIn  →  $targetOut" -ForegroundColor Yellow
} elseif (Test-Path $Yabber) {
  Write-Host "Run Yabber on $targetIn to generate $targetOut." -ForegroundColor Cyan
} else {
  Write-Host "No packer set. Install WitchyBND or Yabber and update config\paths.toml." -ForegroundColor Red
}
