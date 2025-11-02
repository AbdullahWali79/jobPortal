# PowerShell script to import Vercel environment variables
# Run this script: .\vercel-env-import.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel Environment Variables Import" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables to add
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://xwohxmigixrrlcpspsqs.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b2h4bWlnaXhycmxjcHNwc3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDQ5MjksImV4cCI6MjA3NzU4MDkyOX0.TZTBhL7vTtZCkBHNNtaiFDF8BFHX6i6UTwh59E-qmmM"
    "SUPABASE_SERVICE_ROLE_KEY" = "[NEED_TO_GET_FROM_SUPABASE_DASHBOARD]"
    "NEXT_PUBLIC_DEFAULT_JOB_DISPLAY_DAYS" = "5"
}

Write-Host "This script will help you add environment variables to Vercel." -ForegroundColor Yellow
Write-Host ""
Write-Host "For each variable, you'll be prompted to:" -ForegroundColor Yellow
Write-Host "1. Enter the value (or press Enter to use the default)" -ForegroundColor Yellow
Write-Host "2. Select environments (Production, Preview, Development)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to cancel at any time." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"

foreach ($varName in $envVars.Keys) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Adding: $varName" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    if ($varName -eq "SUPABASE_SERVICE_ROLE_KEY" -and $envVars[$varName] -eq "[NEED_TO_GET_FROM_SUPABASE_DASHBOARD]") {
        Write-Host "⚠️  IMPORTANT: You need to get this value from Supabase Dashboard" -ForegroundColor Red
        Write-Host "Go to: https://supabase.com/dashboard/project/xwohxmigixrrlcpspsqs" -ForegroundColor Cyan
        Write-Host "Navigate to: Settings → API → service_role key" -ForegroundColor Cyan
        Write-Host ""
        $serviceKey = Read-Host "Enter your SUPABASE_SERVICE_ROLE_KEY"
        if ($serviceKey) {
            $envVars[$varName] = $serviceKey
        }
    } else {
        Write-Host "Default value: $($envVars[$varName])" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Running: vercel env add $varName" -ForegroundColor Cyan
    Write-Host "When prompted:" -ForegroundColor Yellow
    Write-Host "  - Paste the value above" -ForegroundColor Yellow
    Write-Host "  - Select all 3 environments (Production, Preview, Development)" -ForegroundColor Yellow
    Write-Host ""
    
    vercel env add $varName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to add $varName" -ForegroundColor Red
    } else {
        Write-Host "✅ Successfully added $varName" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All environment variables added!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now deploy to production:" -ForegroundColor Yellow
Write-Host "  vercel --prod" -ForegroundColor Cyan
Write-Host ""

