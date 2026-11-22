# SoftenWise — asset ?v= bump (wrapper)
# Tercih: npm run bump
# Eski kullanım: .\scripts\apply-asset-version.ps1
# Opsiyonel sabit sürüm: .\scripts\apply-asset-version.ps1 -Version 202611231145

param(
  [string]$Version = ""
)

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

if ($Version) {
  npm run bump -- --set $Version
} else {
  npm run bump
}
