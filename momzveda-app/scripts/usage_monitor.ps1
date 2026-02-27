# API Usage Monitoring Script
param(
    [Parameter(Mandatory=$false)]
    [string]$action = "status"
)

$USAGE_FILE = "../api_usage.log"
$ALERT_THRESHOLD = 80 # 80% of daily limit

function Show-Usage {
    if (Test-Path $USAGE_FILE) {
        $usage = Get-Content $USAGE_FILE | Select-Object -Last 10
        Write-Host "`n📊 Recent API Usage:"
        Write-Host "------------------------"
        $usage | ForEach-Object { Write-Host $_ }
        Write-Host "------------------------"
    } else {
        Write-Host "No usage data available yet"
    }
}

function Check-Limits {
    Write-Host "`n💰 Cost Management:"
    Write-Host "------------------------"
    Write-Host "Daily Limit: $10.00"
    Write-Host "Alert Threshold: ${ALERT_THRESHOLD}%"
    Write-Host "------------------------"
}