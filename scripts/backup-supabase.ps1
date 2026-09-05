[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backupDirectory = Join-Path $workspaceRoot "backups\\supabase\\$timestamp"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker Desktop must be installed and running before creating a Supabase CLI database dump.'
}

New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

Push-Location $workspaceRoot
try {
  Write-Host 'Snapshotting database migrations...'
  Copy-Item -LiteralPath (Join-Path $workspaceRoot 'supabase\migrations') -Destination (Join-Path $backupDirectory 'migrations') -Recurse -Force

  Write-Host 'Exporting public database data...'
  & npx.cmd supabase db dump --linked --schema public --data-only --use-copy -f (Join-Path $backupDirectory 'data.sql')
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase data export failed with exit code $LASTEXITCODE. The backup is incomplete."
  }

  $dataPath = Join-Path $backupDirectory 'data.sql'
  if (-not (Test-Path -LiteralPath $dataPath) -or (Get-Item -LiteralPath $dataPath).Length -eq 0) {
    throw 'Supabase did not create a usable data.sql export. The backup is incomplete.'
  }

  @{
    createdAt = (Get-Date).ToString('o')
    projectRef = 'rbwebcsuqvngbhltdtzm'
    contents = @('migration snapshot', 'public data')
    excluded = @('Supabase Auth managed schema', 'Supabase Storage object files', 'Cloudinary media')
  } | ConvertTo-Json | Set-Content -Path (Join-Path $backupDirectory 'manifest.json') -Encoding utf8

  Write-Host "Verified backup completed: $backupDirectory" -ForegroundColor Green
  Write-Host 'Copy this dated folder to a private encrypted drive or private cloud storage. Do not commit it to Git.' -ForegroundColor Yellow
}
finally {
  Pop-Location
}
