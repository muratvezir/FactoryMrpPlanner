using Microsoft.AspNetCore.Mvc;
using Mrp.Core.Entities;
using Mrp.Core.Enums;
using Mrp.Engine.Services;

namespace Mrp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanningController : ControllerBase
{
    private readonly MrpCalculationService _mrpService;

    public PlanningController()
    {
        _mrpService = new MrpCalculationService();
    }

    /// <summary>
    /// MRP hesaplaması yapar ve üretim/satın alma önerileri döner.
    /// </summary>
    [HttpPost("calculate")]
    public ActionResult<MrpResult> Calculate([FromBody] MrpInput input)
    {
        if (input.Items == null || !input.Items.Any())
            return BadRequest("En az bir ürün gerekli.");
            
        if (input.Demands == null || !input.Demands.Any())
            return BadRequest("En az bir talep gerekli.");
            
        var result = _mrpService.Calculate(input);
        return Ok(result);
    }
    
    /// <summary>
    /// Veri setini doğrular, hesaplama yapmaz.
    /// </summary>
    [HttpPost("validate")]
    public ActionResult Validate([FromBody] MrpInput input)
    {
        var errors = new List<string>();
        
        // Döngü kontrolü (BOM içinde kendisine referans var mı?)
        foreach (var item in input.Items)
        {
            var visited = new HashSet<string>();
            if (HasCycle(item.Code, input.Items.ToDictionary(i => i.Code), visited))
            {
                errors.Add($"Döngüsel referans tespit edildi: {item.Code}");
            }
        }
        
        // Eksik malzeme kontrolü
        var allCodes = input.Items.Select(i => i.Code).ToHashSet();
        foreach (var item in input.Items)
        {
            foreach (var bom in item.BillOfMaterials)
            {
                if (!allCodes.Contains(bom.ChildItemCode))
                {
                    errors.Add($"BOM'da eksik malzeme: {bom.ChildItemCode} ({item.Code} için)");
                }
            }
        }
        
        if (errors.Any())
            return BadRequest(new { valid = false, errors });
            
        return Ok(new { valid = true, message = "Veri seti geçerli." });
    }
    
    private bool HasCycle(string code, Dictionary<string, Item> items, HashSet<string> visited)
    {
        if (visited.Contains(code)) return true;
        if (!items.ContainsKey(code)) return false;
        
        visited.Add(code);
        foreach (var bom in items[code].BillOfMaterials)
        {
            if (HasCycle(bom.ChildItemCode, items, new HashSet<string>(visited)))
                return true;
        }
        return false;
    }
}
