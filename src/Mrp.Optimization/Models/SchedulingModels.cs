namespace Factory.Optimization.Models;

public class ManufacturingJob
{
    public string JobId { get; set; } = string.Empty;
    public int Duration { get; set; }        // Gün cinsinden (tam sayı)
    public int MachineId { get; set; }       // Hangi makine/hat? (Basitlik için int)
    public DateTime EarliestStartDate { get; set; } // En erken başlama (Malzeme temini vs.)
    public DateTime DueDate { get; set; }    // Teslim tarihi
}

public class ScheduledJob
{
    public string JobId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsLate { get; set; }
}
