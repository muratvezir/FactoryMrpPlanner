using Mrp.Core.Enums;

namespace Mrp.Core.Entities;

public class Suggestion
{
    public int Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public ActionType Action { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Quantity { get; set; }
    public string PeggingInfo { get; set; } = string.Empty;  // Hangi sipariş için
}
