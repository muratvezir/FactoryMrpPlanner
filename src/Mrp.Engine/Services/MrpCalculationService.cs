using Mrp.Core.Entities;
using Mrp.Core.Enums;

namespace Mrp.Engine.Services;

public class MrpCalculationService
{
    public MrpResult Calculate(MrpInput input)
    {
        var suggestions = new List<Suggestion>();
        var exceptions = new List<PlanningException>();
        
        // 1. Low-Level Code hesapla
        CalculateLowLevelCodes(input.Items);
        
        // 2. Seviyeye göre sırala (düşükten yükseğe - LLC 0 önce)
        var sortedItems = input.Items.OrderBy(i => i.LowLevelCode).ToList();
        
        // 3. Her seviye için MRP döngüsü
        var grossRequirements = InitializeGrossRequirements(input.Demands);
        
        foreach (var item in sortedItems)
        {
            var itemCode = item.Code;
            if (!grossRequirements.ContainsKey(itemCode)) continue;
            
            // Stok takibi için kopyala
            var availableStock = item.OnHand;
            
            foreach (var (dueDate, grossQty, sourceId) in grossRequirements[itemCode].OrderBy(r => r.dueDate))
            {
                // Net ihtiyaç = Brüt - Stok + Emniyet
                var netQty = Math.Max(0, grossQty - availableStock + item.SafetyStock);
                
                if (netQty <= 0)
                {
                    // Stoktan karşılandı
                    availableStock -= grossQty;
                    continue;
                }
                
                // Lot sizing
                var lotQty = ApplyLotSizing(netQty, item.MinOrderQty);
                
                // Zamanlama (backward scheduling)
                var startDate = dueDate.AddDays(-item.LeadTimeDays);
                
                // Geçmiş tarih kontrolü
                if (startDate < DateOnly.FromDateTime(DateTime.Today))
                {
                    exceptions.Add(new PlanningException
                    {
                        ItemCode = itemCode,
                        Type = ExceptionType.LateDemand,
                        Message = $"Temin süresi nedeniyle başlangıç tarihi geçmişte: {startDate}",
                        AffectedDate = startDate
                    });
                }
                
                // Stok yetersizliği uyarısı (kritik eksiklik - stok sıfır ve yüksek talep)
                if (item.OnHand == 0 && netQty > item.MinOrderQty * 3)
                {
                    exceptions.Add(new PlanningException
                    {
                        ItemCode = itemCode,
                        Type = ExceptionType.Shortage,
                        Message = $"Kritik stok yetersizliği: {netQty} adet gerekli, stok sıfır",
                        AffectedDate = dueDate
                    });
                }
                
                // Öneri oluştur
                var action = item.Type == ItemType.RawMaterial ? ActionType.Buy : ActionType.Make;
                suggestions.Add(new Suggestion
                {
                    ItemCode = itemCode,
                    Action = action,
                    StartDate = startDate,
                    EndDate = dueDate,
                    Quantity = lotQty,
                    PeggingInfo = sourceId ?? "Üretim ihtiyacı"
                });
                
                // Stok güncelle
                availableStock = availableStock - grossQty + lotQty;
                
                // BOM Patlatma (eğer üretilecekse)
                if (action == ActionType.Make)
                {
                    foreach (var bom in item.BillOfMaterials)
                    {
                        var childQty = lotQty * bom.EffectiveQuantity;
                        AddGrossRequirement(grossRequirements, bom.ChildItemCode, startDate, childQty, $"{itemCode} üretimi için");
                    }
                }
            }
        }
        
        return new MrpResult 
        { 
            PlanId = Guid.NewGuid(),
            GeneratedAt = DateTime.UtcNow,
            Suggestions = suggestions, 
            Exceptions = exceptions 
        };
    }
    
    private void CalculateLowLevelCodes(List<Item> items)
    {
        var itemDict = items.ToDictionary(i => i.Code);
        foreach (var item in items)
        {
            item.LowLevelCode = GetDepth(item.Code, itemDict, new HashSet<string>());
        }
    }
    
    private int GetDepth(string code, Dictionary<string, Item> items, HashSet<string> visited)
    {
        if (!items.ContainsKey(code) || visited.Contains(code)) return 0;
        visited.Add(code);
        
        var item = items[code];
        if (!item.BillOfMaterials.Any()) return 0;
        
        return 1 + item.BillOfMaterials.Max(b => GetDepth(b.ChildItemCode, items, new HashSet<string>(visited)));
    }
    
    private decimal ApplyLotSizing(decimal netQty, decimal minOrderQty)
    {
        if (minOrderQty <= 0) return netQty;
        return Math.Ceiling(netQty / minOrderQty) * minOrderQty;
    }
    
    private Dictionary<string, List<(DateOnly dueDate, decimal qty, string? sourceId)>> InitializeGrossRequirements(List<Demand> demands)
    {
        var result = new Dictionary<string, List<(DateOnly, decimal, string?)>>();
        foreach (var d in demands)
        {
            if (!result.ContainsKey(d.ItemCode))
                result[d.ItemCode] = new();
            result[d.ItemCode].Add((d.DueDate, d.Quantity, d.SourceId));
        }
        return result;
    }
    
    private void AddGrossRequirement(
        Dictionary<string, List<(DateOnly dueDate, decimal qty, string? sourceId)>> requirements, 
        string itemCode, DateOnly dueDate, decimal qty, string source)
    {
        if (!requirements.ContainsKey(itemCode))
            requirements[itemCode] = new();
        requirements[itemCode].Add((dueDate, qty, source));
    }
}

public class MrpInput
{
    public List<Item> Items { get; set; } = new();
    public List<Demand> Demands { get; set; } = new();
}

public class MrpResult
{
    public Guid PlanId { get; set; }
    public DateTime GeneratedAt { get; set; }
    public List<Suggestion> Suggestions { get; set; } = new();
    public List<PlanningException> Exceptions { get; set; } = new();
}
