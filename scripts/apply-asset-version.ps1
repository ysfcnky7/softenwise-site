# Bump $AssetVersion when CSS/JS change, then run: .\scripts\apply-asset-version.ps1
$AssetVersion = "202604081"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")

Get-ChildItem -Path $root -Filter "*.html" | ForEach-Object {
  $p = $_.FullName
  $c = [IO.File]::ReadAllText($p)
  $c = $c -replace 'href="css/local-fonts\.css[^"]*"', "href=`"css/local-fonts.css?v=$AssetVersion`""
  $c = $c -replace 'href="css/style\.css[^"]*"', "href=`"css/style.css?v=$AssetVersion`""
  $c = $c -replace 'src="js/sprite-inject\.js[^"]*"', "src=`"js/sprite-inject.js?v=$AssetVersion`""
  $c = $c -replace 'src="js/main\.js[^"]*"', "src=`"js/main.js?v=$AssetVersion`""
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [IO.File]::WriteAllText($p, $c, $utf8)
}

Write-Host "Applied asset version v=$AssetVersion to HTML in $root"
