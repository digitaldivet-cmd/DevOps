# Azure Service Principal Setup Script for GitHub Actions
# Run this script to generate credentials for your GitHub Repository Secrets

$ErrorActionPreference = "Stop"

# Configuration
$ResourceGroup = "DevOpsProjectRG"
$Location = "centralus"
$AcrName = "devopsacr" + (Get-Random -Minimum 1000 -Maximum 9999)
$GitHubRepoName = "devops-microservices" # Optional context

Write-Host "🚀 Setting up Azure Resources for GitHub Actions..." -ForegroundColor Cyan

# 1. Login
Write-Host "1️⃣ Logging in..." -ForegroundColor Yellow
az login --output none
if ($LASTEXITCODE -ne 0) { Write-Error "Login failed"; exit }

# 2. Get Subscription ID
$SubscriptionId = az account show --query id --output tsv
Write-Host "✅ Using Subscription: $SubscriptionId" -ForegroundColor Green

# 3. Create Resource Group (Idempotent - using eastus to match existing)
Write-Host "2️⃣ Checking Resource Group..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location eastus --output none

# 4. Create ACR (Idempotent)
Write-Host "3️⃣ Checking Container Registry..." -ForegroundColor Yellow
# Check if ACR exists with a specific pattern or just create new one
# Since names must be unique, we will try to find one or create one
# For simplicity in this script, we'll try to create one, if it exists az handles it (unless name is taken by others)
# Let's check if the user already created one in previous steps (devopsacr4066 from user logs)
# We will list ACRs and pick the first one or create new.
$ExistingAcr = az acr list --resource-group $ResourceGroup --query "[0].name" --output tsv
if ($ExistingAcr) {
    $AcrName = $ExistingAcr
    Write-Host "   Using existing ACR: $AcrName" -ForegroundColor Cyan
}
else {
    az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic --admin-enabled true --output none
    Write-Host "   Created new ACR: $AcrName" -ForegroundColor Cyan
}

$AcrLoginServer = az acr show --name $AcrName --query loginServer --output tsv

# 5. Create Service Principal
Write-Host "4️⃣ Creating Service Principal for GitHub..." -ForegroundColor Yellow
$SpName = "github-actions-sp-$AcrName"
# Assign 'Contributor' to RG (covers ACR push/pull and general deployment)
$SpJson = az ad sp create-for-rbac --name $SpName --role Contributor --scopes /subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup --sdk-auth --output json

if (-not $SpJson) {
    Write-Error "Failed to create Service Principal"
    exit
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================================================================"
Write-Host "ACTION REQUIRED: Add the following secret to your GitHub Repository"
Write-Host "Settings > Secrets and variables > Actions > New repository secret"
Write-Host "================================================================"
Write-Host "Name:  AZURE_CREDENTIALS"
Write-Host "Value: (Copy the entire JSON block below)"
Write-Host "----------------------------------------------------------------"
$SpJson
Write-Host "----------------------------------------------------------------"
Write-Host "Also ensure you update your workflow file with:"
Write-Host "ACR_LOGIN_SERVER: $AcrLoginServer"
Write-Host "================================================================"
