using Mrp.Core.Enums;

namespace Mrp.Core.Entities;

public class Item
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public ItemType Type { get; set; }
    public decimal OnHand { get; set; }           // Eldeki stok
    public int LeadTimeDays { get; set; }         // Temin süresi
    public decimal MinOrderQty { get; set; }      // Min sipariş miktarı
    public decimal SafetyStock { get; set; }      // Emniyet stoğu
    public int LowLevelCode { get; set; }         // Ağaç seviyesi
    public List<BomLine> BillOfMaterials { get; set; } = new();
}
