# Copy template assets from lamis-invitation and ahmed-sameha projects
# Run from project root: .\scripts\copy-template-assets.ps1

$lamisPath = "..\lamis-invitation\public"
$ahmedPath = "..\ahmed-sameha\public"

if (-not (Test-Path $lamisPath)) {
    Write-Host "lamis-invitation not found at $lamisPath - please set correct path"
    exit 1
}
if (-not (Test-Path $ahmedPath)) {
    Write-Host "ahmed-sameha not found at $ahmedPath - please set correct path"
    exit 1
}

New-Item -ItemType Directory -Force -Path "public\templates\lamis" | Out-Null
New-Item -ItemType Directory -Force -Path "public\templates\ahmed" | Out-Null

Copy-Item "$lamisPath\*" "public\templates\lamis\" -Recurse -Force
Copy-Item "$ahmedPath\*" "public\templates\ahmed\" -Recurse -Force

Write-Host "Template assets copied successfully!"
