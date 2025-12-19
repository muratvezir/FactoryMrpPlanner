$baseUrl = "http://localhost:5260/api"

# 1. Malzemeler (Items) ve Reçeteler (BOM)
$materials = @(
    # Hammaddeler
    @{
        code = "RM-BAKIR-001"
        type = 0 # RawMaterial
        onHand = 5000
        leadTimeDays = 5
        minOrderQty = 1000
        safetyStock = 500
        lowLevelCode = 1
    },
    @{
        code = "RM-PVC-SIYAH"
        type = 0
        onHand = 2000
        leadTimeDays = 3
        minOrderQty = 500
        safetyStock = 200
        lowLevelCode = 1
    },
    @{
        code = "RM-PVC-MAVI"
        type = 0
        onHand = 2000
        leadTimeDays = 3
        minOrderQty = 500
        safetyStock = 200
        lowLevelCode = 1
    },
    @{
        code = "RM-PVC-KAHVE"
        type = 0
        onHand = 2000
        leadTimeDays = 3
        minOrderQty = 500
        safetyStock = 200
        lowLevelCode = 1
    },
    
    # Yarı Mamuller (Damarlar)
    @{
        code = "SM-DAMAR-1.5-MAVI"
        type = 1 # WorkInProgress
        onHand = 0
        leadTimeDays = 1
        minOrderQty = 1000
        safetyStock = 0
        lowLevelCode = 0
        billOfMaterials = @(
            @{ childItemCode = "RM-BAKIR-001"; quantity = 0.015; scrapRate = 0.02 }, # 1 metre için kg
            @{ childItemCode = "RM-PVC-MAVI"; quantity = 0.008; scrapRate = 0.01 }
        )
    },
    @{
        code = "SM-DAMAR-1.5-KAHVE"
        type = 1
        onHand = 0
        leadTimeDays = 1
        minOrderQty = 1000
        safetyStock = 0
        lowLevelCode = 0
        billOfMaterials = @(
            @{ childItemCode = "RM-BAKIR-001"; quantity = 0.015; scrapRate = 0.02 },
            @{ childItemCode = "RM-PVC-KAHVE"; quantity = 0.008; scrapRate = 0.01 }
        )
    },

    # Mamul (Kablo 2x1.5)
    @{
        code = "FG-KABLO-2x1.5-TTR"
        type = 2 # FinishedGood
        onHand = 100
        leadTimeDays = 2
        minOrderQty = 500
        safetyStock = 100
        lowLevelCode = 0
        billOfMaterials = @(
            @{ childItemCode = "SM-DAMAR-1.5-MAVI"; quantity = 1; scrapRate = 0.0 },
            @{ childItemCode = "SM-DAMAR-1.5-KAHVE"; quantity = 1; scrapRate = 0.0 },
            @{ childItemCode = "RM-PVC-SIYAH"; quantity = 0.05; scrapRate = 0.03 } # Dış kılıf
        )
    }
)

Write-Host "Malzemeler aktarılıyor..."
foreach ($item in $materials) {
    try {
        $json = $item | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$baseUrl/materials" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "Eklendi: $($item.code)"
    } catch {
        Write-Host "Hata ($($item.code)): $_"
    }
}

# 2. Siparişler (Orders)
$orders = @(
    @{
        itemCode = "FG-KABLO-2x1.5-TTR"
        quantity = 2000
        dueDate = (Get-Date).AddDays(10).ToString("yyyy-MM-dd")
        type = 0 # Order
        sourceId = "SIP-2024-001"
    },
    @{
        itemCode = "FG-KABLO-2x1.5-TTR"
        quantity = 5000
        dueDate = (Get-Date).AddDays(20).ToString("yyyy-MM-dd")
        type = 0 # Order
        sourceId = "SIP-2024-002"
    }
)

Write-Host "`nSiparişler aktarılıyor..."
foreach ($order in $orders) {
    try {
        $json = $order | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/orders" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "Sipariş Eklendi: $($order.sourceId)"
    } catch {
        Write-Host "Hata ($($order.sourceId)): $_"
    }
}
