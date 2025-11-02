# Import Vercel Environment Variables from vercel.env file
# Usage: .\import-vercel-env.ps1

if (-not (Test-Path "vercel.env")) {
    Write-Host "❌ vercel.env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Importing Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Read the env file
$envContent = Get-Content "vercel.env" | Where-Object { $_ -notmatch '^\s*#' -and $_ -match '=' }

foreach ($line in $envContent) {
    if ($line -match '^\s*([^=]+)=(.*)$') {
        $varName = $matches[1].Trim()
        $varValue = $matches[2].Trim()
        
        # Skip if value is placeholder
        if ($varValue -eq "your_service_role_key_here") {
            Write-Host "⚠️  Skipping $varName (needs actual value from Supabase)" -ForegroundColor Yellow
            Write-Host "   Get it from: https://supabase.com/dashboard/project/xwohxmigixrrlcpspsqs → Settings → API" -ForegroundColor Gray
            Write-Host ""
            continue
        }
        
        Write-Host "Adding: $varName" -ForegroundColor Green
        Write-Host "Value: $($varValue.Substring(0, [Math]::Min(50, $varValue.Length)))..." -ForegroundColor Gray
        Write-Host ""
        
        # Note: Vercel CLI env add is interactive, so we'll just show the command
        Write-Host "Run this command:" -ForegroundColor Yellow
        Write-Host "  vercel env add $varName" -ForegroundColor Cyan
        Write-Host "  When prompted, paste: $varValue" -ForegroundColor Gray
        Write-Host "  Select: Production, Preview, Development (all 3)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Press Enter to continue to next variable, or Ctrl+C to stop" -ForegroundColor Yellow
        Read-Host
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After adding all variables, run:" -ForegroundColor Cyan
Write-Host "  vercel --prod" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

