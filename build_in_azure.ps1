# Azure Build & Deploy Script
# This script builds your Docker images directly in Azure (no local Docker required!)

$ErrorActionPreference = "Stop"

# Configuration
$ResourceGroup = "DevOpsProjectRG"
$Location = "eastus"
$AcrName = "devopsacr" + (Get-Random -Minimum 1000 -Maximum 9999) # Generates a unique name

Write-Host "🚀 Starting Cloud Build Process..." -ForegroundColor Cyan

# 1. Login to Azure
Write-Host "1️⃣ Logging in to Azure..." -ForegroundColor Yellow
az login
if ($LASTEXITCODE -ne 0) { Write-Error "Login failed"; exit }

# 2. Create Resource Group
Write-Host "2️⃣ Creating Resource Group: $ResourceGroup..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# 3. Create Azure Container Registry (ACR)
Write-Host "3️⃣ Creating Container Registry: $AcrName..." -ForegroundColor Yellow
az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic --admin-enabled true

# Get Login Server
$AcrServer = az acr show --name $AcrName --query loginServer --output tsv
Write-Host "✅ ACR Created: $AcrServer" -ForegroundColor Green

# 4. Build Audit Service
Write-Host "4️⃣ Building Audit Service in Azure..." -ForegroundColor Yellow
az acr build --registry $AcrName --image audit-service:latest --file AuditService/AuditService/Dockerfile AuditService/AuditService

# 5. Build Data Entry API
Write-Host "5️⃣ Building Data Entry API in Azure..." -ForegroundColor Yellow
az acr build --registry $AcrName --image data-entry-api:latest --file DataEntryApi/DataEntryApi/Dockerfile DataEntryApi/DataEntryApi

# 6. Build Frontend
Write-Host "6️⃣ Building Frontend in Azure..." -ForegroundColor Yellow
az acr build --registry $AcrName --image audit-frontend:latest --file AuditService/audit-frontend/Dockerfile AuditService/audit-frontend

Write-Host "`n🎉 Build Complete!" -ForegroundColor Green
Write-Host "Your images are hosted in Azure Container Registry:"
Write-Host " - $AcrServer/audit-service:latest"
Write-Host " - $AcrServer/data-entry-api:latest"
Write-Host " - $AcrServer/audit-frontend:latest"
Write-Host "`nYou can now deploy these images to Azure App Service or Container Apps."
