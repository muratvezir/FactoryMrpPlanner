using Mrp.Core.Enums;

namespace Mrp.Core.Entities;

public class PlanningException
{
    public string ItemCode { get; set; } = string.Empty;
    public ExceptionType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateOnly? AffectedDate { get; set; }
}
