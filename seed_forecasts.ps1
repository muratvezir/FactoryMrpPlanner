$baseUrl = "http://localhost:5260/api"

# 3. Talepler / Tahminler (Forecasts)
$forecasts = @(
    @{
        itemCode = "FG-KABLO-2x1.5-TTR"
        quantity = 10000
        dueDate = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
        type = 1 # Forecast
        sourceId = "TAHMIN-2024-Q2"
    },
    @{
        itemCode = "FG-KABLO-2x1.5-TTR"
        quantity = 15000
        dueDate = (Get-Date).AddDays(60).ToString("yyyy-MM-dd")
        type = 1 # Forecast
        sourceId = "TAHMIN-2024-Q3"
    },
     @{
        itemCode = "SM-DAMAR-1.5-MAVI"
        quantity = 5000
        dueDate = (Get-Date).AddDays(15).ToString("yyyy-MM-dd")
        type = 1 # Forecast (Yarı mamul satışı veya ihtiyacı)
        sourceId = "TAHMIN-YARI-MAMUL"
    }
)

Write-Host "Talepler (Tahminler) aktarılıyor..."
foreach ($fc in $forecasts) {
    try {
        $json = $fc | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "Tahmin Eklendi: $($fc.sourceId)"
    } catch {
        Write-Host "Hata ($($fc.sourceId)): $_"
    }
}
