# ==========================================================
# AKS Provisioning and Deployment Script (FIXED VERSION)
# Region-safe, VM-safe, Student-subscription friendly
# ==========================================================

$ErrorActionPreference = "Stop"

# ---------------- Configuration ----------------
$ResourceGroup = "DevOpsProjectRG"
$Location = "centralus"              # ✅ CHANGED (stable region)
$AksClusterName = "devops-cluster"
$NodeVmSize = "Standard_D2s_v3"     # ✅ EXPLICIT VM SIZE (IMPORTANT)
$NodeCount = 1
# ------------------------------------------------

Write-Host "🚀 Starting Cloud Deployment Process..." -ForegroundColor Cyan

# ------------------------------------------------
# 1️⃣ Login (assumes already logged in)
# ------------------------------------------------
# az login

# ------------------------------------------------
# 2️⃣ Find Existing ACR
# ------------------------------------------------
Write-Host "1️⃣ Locating Container Registry..." -ForegroundColor Yellow

$AcrName = az acr list `
    --resource-group $ResourceGroup `
    --query "[0].name" `
    --output tsv

if (-not $AcrName) {
    Write-Error "❌ No Azure Container Registry found in resource group '$ResourceGroup'."
    exit 1
}

$AcrLoginServer = az acr show `
    --name $AcrName `
    --query loginServer `
    --output tsv

Write-Host "   ✅ Found ACR: $AcrLoginServer" -ForegroundColor Green

# ------------------------------------------------
# 3️⃣ Create AKS Cluster
# ------------------------------------------------
Write-Host "2️⃣ Creating Kubernetes Cluster '$AksClusterName'..." -ForegroundColor Yellow
Write-Host "   📍 Region: $Location | VM Size: $NodeVmSize" -ForegroundColor Cyan

az aks create `
    --resource-group $ResourceGroup `
    --name $AksClusterName `
    --location $Location `
    --node-count $NodeCount `
    --node-vm-size $NodeVmSize `
    --enable-addons monitoring `
    --generate-ssh-keys `
    --attach-acr $AcrName `
    --output none

Write-Host "   ✅ Cluster Created Successfully!" -ForegroundColor Green

# ------------------------------------------------
# 4️⃣ Get kubectl Credentials
# ------------------------------------------------
Write-Host "3️⃣ Connecting to AKS Cluster..." -ForegroundColor Yellow

az aks get-credentials `
    --resource-group $ResourceGroup `
    --name $AksClusterName `
    --overwrite-existing

Write-Host "   ✅ kubectl configured" -ForegroundColor Green

# ------------------------------------------------
# 5️⃣ Update Kubernetes Manifests
# ------------------------------------------------
Write-Host "4️⃣ Updating Deployment Manifests..." -ForegroundColor Yellow

$ManifestFile = "k8s/all_resources.yaml"
$GeneratedFile = "k8s/deploy_generated.yaml"

if (-not (Test-Path $ManifestFile)) {
    Write-Error "❌ Manifest file not found: $ManifestFile"
    exit 1
}

$Content = Get-Content $ManifestFile -Raw

$Content = $Content -replace "REPLACE_WITH_ACR_NAME.azurecr.io", $AcrLoginServer
$Content = $Content -replace "REPLACE_WITH_ACR_NAME", $AcrName

Set-Content -Path $GeneratedFile -Value $Content

Write-Host "   ✅ Generated manifest: $GeneratedFile" -ForegroundColor Green

# ------------------------------------------------
# 6️⃣ Deploy to Kubernetes
# ------------------------------------------------
Write-Host "5️⃣ Deploying workloads to AKS..." -ForegroundColor Yellow

kubectl apply -f $GeneratedFile

Write-Host "   ✅ Deployment applied" -ForegroundColor Green

# ------------------------------------------------
# 7️⃣ Wait for External IP
# ------------------------------------------------
Write-Host "⏳ Waiting for External IP (up to 5 minutes)..." -ForegroundColor Yellow

$FrontendIp = ""

for ($i = 0; $i -lt 30; $i++) {
    $FrontendIp = kubectl get service audit-frontend `
        --output jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null

    if ($FrontendIp) { break }
    Start-Sleep -Seconds 10
}

# ------------------------------------------------
# 8️⃣ Final Output
# ------------------------------------------------
Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green

if ($FrontendIp) {
    Write-Host "🌍 Application URL: http://$FrontendIp" -ForegroundColor Cyan
}
else {
    Write-Host "⚠️ External IP not assigned yet." -ForegroundColor Yellow
    Write-Host "   Run later: kubectl get service audit-frontend" -ForegroundColor Yellow
}
