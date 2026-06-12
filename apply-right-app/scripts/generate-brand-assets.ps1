# Generates the Nuivo brand assets: a green letter "N" used on the splash
# screen and app icon. Uses System.Drawing (built into Windows) so no npm
# packages are required. Re-run after tweaking $Green / $Letter / $Font.
#
#   powershell -ExecutionPolicy Bypass -File scripts/generate-brand-assets.ps1

Add-Type -AssemblyName System.Drawing

$AssetsDir = Join-Path $PSScriptRoot '..\assets'
$Size      = 1024
$Green     = '#059669'   # emerald
$Black     = '#000000'
$White     = '#FFFFFF'
$Letter    = 'N'
$FontName  = 'Segoe UI Black'   # falls back if unavailable

function ColorFromHex([string]$hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

# Draws $Letter centered on a $Size x $Size canvas.
#   -BgHex  : background fill, or $null for transparent
#   -FgHex  : letter color
#   -Ratio  : letter height as a fraction of canvas (controls how big the N is)
#   -OutFile: output path
function New-LetterPng([string]$BgHex, [string]$FgHex, [double]$Ratio, [string]$OutFile) {
  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g   = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  if ($BgHex) {
    $g.Clear((ColorFromHex $BgHex))
  } else {
    $g.Clear([System.Drawing.Color]::Transparent)
  }

  # Pick a font size so the glyph height is ~ $Ratio of the canvas.
  $fontSize = [float]($Size * $Ratio)
  $font = New-Object System.Drawing.Font($FontName, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

  $brush = New-Object System.Drawing.SolidBrush((ColorFromHex $FgHex))
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment     = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center

  $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
  $g.DrawString($Letter, $font, $brush, $rect, $fmt)

  $g.Dispose()
  $full = Join-Path $AssetsDir $OutFile
  $bmp.Save($full, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  wrote $OutFile"
}

Write-Host "Generating brand assets into $AssetsDir"

# Splash: transparent green N (plugin paints the black background). Big N.
New-LetterPng -BgHex $null  -FgHex $Green -Ratio 0.62 -OutFile 'splash-icon.png'

# iOS / general icon: solid black square, green N.
New-LetterPng -BgHex $Black -FgHex $Green -Ratio 0.58 -OutFile 'icon.png'

# Android adaptive foreground: transparent, green N kept small so the circular
# launcher crop never clips it (safe zone ~ inner 66%).
New-LetterPng -BgHex $null  -FgHex $Green -Ratio 0.40 -OutFile 'android-icon-foreground.png'

# Android themed (monochrome) channel: white N on transparent.
New-LetterPng -BgHex $null  -FgHex $White -Ratio 0.40 -OutFile 'android-icon-monochrome.png'

Write-Host "Done."
