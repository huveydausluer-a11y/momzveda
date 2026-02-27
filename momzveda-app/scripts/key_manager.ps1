# API Key Management Script
param(
    [Parameter(Mandatory=$false)]
    [string]$action = "check"
)

$ENV_FILE = "../.env.local"
$BACKUP_DIR = "../.keys_backup"
$LOG_FILE = "../api_usage.log"

function Check-Keys {
    if (!(Test-Path $ENV_FILE)) {
        Write-Host "❌ No API configuration found."
        return $false
    }

    $content = Get-Content $ENV_FILE
    $hasClaudeKey = $content | Select-String "CLAUDE_API_KEY=.+"
    $hasOpenAIKey = $content | Select-String "OPENAI_API_KEY=.+"

    Write-Host "`n🔑 API Keys Status:"
    Write-Host "------------------------"
    Write-Host "Claude API: $(if ($hasClaudeKey) {'✅ Configured'} else {'❌ Missing'})"
    Write-Host "OpenAI API: $(if ($hasOpenAIKey) {'✅ Configured'} else {'❌ Missing'})"
    Write-Host "------------------------"
}

function Backup-Keys {
    if (!(Test-Path $BACKUP_DIR)) {
        New-Item -ItemType Directory -Path $BACKUP_DIR
    }
    
    $timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
    Copy-Item $ENV_FILE "$BACKUP_DIR/.env.backup.$timestamp"
    Write-Host "✅ Keys backed up successfully"
}

function Rotate-Keys {
    Write-Host "⚠️ Key rotation should be done manually through provider websites:"
    Write-Host "1. Claude: https://console.anthropic.com/"
    Write-Host "2. OpenAI: https://platform.openai.com/"
    Write-Host "`nAfter generating new keys:"
    Write-Host "1. Update .env.local with new keys"
    Write-Host "2. Run this script with -action check to verify"
}

# Main script
switch ($action) {
    "check" { Check-Keys }
    "backup" { Backup-Keys }
    "rotate" { Rotate-Keys }
    default { Write-Host "Unknown action. Use: check, backup, or rotate" }
}