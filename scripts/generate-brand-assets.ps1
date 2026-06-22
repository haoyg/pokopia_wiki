param(
  [Parameter(Mandatory = $true)]
  [string]$SourceImage
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root 'public'
$source = [System.Drawing.Bitmap]::FromFile($SourceImage)

function New-TransparentBitmap([int]$Width, [int]$Height) {
  return New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
}

function Draw-FittedImage(
  [System.Drawing.Image]$Image,
  [System.Drawing.Rectangle]$SourceRect,
  [int]$Width,
  [int]$Height,
  [int]$Padding
) {
  $target = New-TransparentBitmap $Width $Height
  $graphics = [System.Drawing.Graphics]::FromImage($target)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

  $availableWidth = $Width - (2 * $Padding)
  $availableHeight = $Height - (2 * $Padding)
  $scale = [Math]::Min($availableWidth / $SourceRect.Width, $availableHeight / $SourceRect.Height)
  $drawWidth = [int][Math]::Round($SourceRect.Width * $scale)
  $drawHeight = [int][Math]::Round($SourceRect.Height * $scale)
  $drawX = [int](($Width - $drawWidth) / 2)
  $drawY = [int](($Height - $drawHeight) / 2)
  $destination = New-Object System.Drawing.Rectangle($drawX, $drawY, $drawWidth, $drawHeight)
  $graphics.DrawImage($Image, $destination, $SourceRect, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  return $target
}

function Save-Png([System.Drawing.Bitmap]$Bitmap, [string]$Path) {
  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Png-Bytes([System.Drawing.Bitmap]$Bitmap) {
  $stream = New-Object System.IO.MemoryStream
  $Bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  [byte[]]$bytes = $stream.ToArray()
  $stream.Dispose()
  return ,$bytes
}

$minX = $source.Width
$minY = $source.Height
$maxX = -1
$maxY = -1
for ($y = 0; $y -lt $source.Height; $y++) {
  for ($x = 0; $x -lt $source.Width; $x++) {
    if ($source.GetPixel($x, $y).A -gt 8) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}

if ($maxX -lt 0 -or $maxY -lt 0) {
  throw 'The source image has no visible pixels.'
}

$logoPadding = 28
$logoX = [Math]::Max(0, $minX - $logoPadding)
$logoY = [Math]::Max(0, $minY - $logoPadding)
$logoRight = [Math]::Min($source.Width - 1, $maxX + $logoPadding)
$logoBottom = [Math]::Min($source.Height - 1, $maxY + $logoPadding)
$logoRect = New-Object System.Drawing.Rectangle($logoX, $logoY, ($logoRight - $logoX + 1), ($logoBottom - $logoY + 1))

# The favicon intentionally focuses on the left emblem; the full wordmark is unreadable below 32px.
$markRect = New-Object System.Drawing.Rectangle(260, 300, 230, 230)

$logo = Draw-FittedImage $source $logoRect 1200 600 20
$mark = Draw-FittedImage $source $markRect 512 512 28
$apple = Draw-FittedImage $source $markRect 180 180 10
$favicon16 = Draw-FittedImage $source $markRect 16 16 1
$favicon32 = Draw-FittedImage $source $markRect 32 32 2

Save-Png $logo (Join-Path $public 'logo.png')
Save-Png $mark (Join-Path $public 'logo-mark.png')
Save-Png $apple (Join-Path $public 'apple-touch-icon.png')
Save-Png $favicon16 (Join-Path $public 'favicon-16x16.png')
Save-Png $favicon32 (Join-Path $public 'favicon-32x32.png')

$icoSizes = @(16, 32, 48, 256)
$icoImages = [System.Collections.Generic.List[byte[]]]::new()
foreach ($size in $icoSizes) {
  $bitmap = Draw-FittedImage $source $markRect $size $size ([Math]::Max(1, [int]($size * 0.06)))
  $icoImages.Add((Png-Bytes $bitmap))
  $bitmap.Dispose()
}

$icoPath = Join-Path $public 'favicon.ico'
$fileStream = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($fileStream)
$writer.Write([UInt16]0)
$writer.Write([UInt16]1)
$writer.Write([UInt16]$icoImages.Count)
$offset = 6 + (16 * $icoImages.Count)

for ($i = 0; $i -lt $icoImages.Count; $i++) {
  $size = $icoSizes[$i]
  [byte[]]$imageBytes = $icoImages[$i]
  $dimension = if ($size -eq 256) { [byte]0 } else { [byte]$size }
  $writer.Write($dimension)
  $writer.Write($dimension)
  $writer.Write([byte]0)
  $writer.Write([byte]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]32)
  $writer.Write([UInt32]$imageBytes.Length)
  $writer.Write([UInt32]$offset)
  $offset += $imageBytes.Length
}

foreach ($imageBytes in $icoImages) {
  $writer.Write([byte[]]$imageBytes)
}

$writer.Dispose()
$fileStream.Dispose()
$favicon16.Dispose()
$favicon32.Dispose()
$apple.Dispose()
$mark.Dispose()
$logo.Dispose()
$source.Dispose()

Write-Output 'Generated logo.png, logo-mark.png, favicon.ico, favicon PNGs, and apple-touch-icon.png.'
