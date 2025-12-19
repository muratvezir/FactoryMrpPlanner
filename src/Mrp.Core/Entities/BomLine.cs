namespace Mrp.Core.Entities;

public class BomLine
{
    public int Id { get; set; }
    public string ParentItemCode { get; set; } = string.Empty;
    public string ChildItemCode { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal ScrapRate { get; set; }   // Fire oranı (0.05 = %5)
    
    // Hesaplanan miktar: Quantity * (1 + ScrapRate)
    public decimal EffectiveQuantity => Quantity * (1 + ScrapRate);
}
