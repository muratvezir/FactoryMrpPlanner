using Mrp.Core.Enums;

namespace Mrp.Core.Entities;

public class Demand
{
    public int Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public DateOnly DueDate { get; set; }
    public decimal Quantity { get; set; }
    public DemandType Type { get; set; }
    public string? SourceId { get; set; }    // Sipariş No
}
