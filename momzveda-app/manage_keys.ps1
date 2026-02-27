# MomzVeda API Key Management Interface
Write-Host @"
===============================
MomzVeda API Key Manager
===============================

Available Commands:
1. Check API key status
2. Backup current keys
3. Show usage statistics
4. View cost management
5. Help with key rotation
0. Exit

"@

while ($true) {
    $choice = Read-Host "Enter command number"
    
    switch ($choice) {
        "1" { 
            Write-Host "`nChecking API keys..."
            ./scripts/key_manager.ps1 -action check
        }
        "2" { 
            Write-Host "`nBacking up keys..."
            ./scripts/key_manager.ps1 -action backup
        }
        "3" { 
            Write-Host "`nFetching usage statistics..."
            ./scripts/usage_monitor.ps1 -action status
        }
        "4" { 
            Write-Host "`nChecking cost limits..."
            ./scripts/usage_monitor.ps1 -action limits
        }
        "5" { 
            Write-Host "`nKey rotation guide..."
            ./scripts/key_manager.ps1 -action rotate
        }
        "0" { 
            Write-Host "Exiting..."
            exit 
        }
        default { Write-Host "Invalid choice. Please try again." }
    }
    
    Write-Host "`nPress Enter to continue..."
    Read-Host
    Clear-Host
    
    Write-Host @"
===============================
MomzVeda API Key Manager
===============================

Available Commands:
1. Check API key status
2. Backup current keys
3. Show usage statistics
4. View cost management
5. Help with key rotation
0. Exit

"@
}