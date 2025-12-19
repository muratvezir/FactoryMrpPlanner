using Microsoft.AspNetCore.Mvc;
using Mrp.Core.Entities;
using Mrp.Core.Enums;

namespace Mrp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    // Simüle edilmiş veritabanı (InMemory)
    private static readonly List<Item> _items = new()
    {
        new() { Id = 1, Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 100, MinOrderQty = 10, LeadTimeDays = 7, SafetyStock = 20 },
        new() { Id = 2, Code = "YARI-001", Type = ItemType.SemiFinished, OnHand = 50, MinOrderQty = 20, LeadTimeDays = 3 },
        new() { Id = 3, Code = "HAMMADDE-001", Type = ItemType.RawMaterial, OnHand = 500, MinOrderQty = 100, LeadTimeDays = 14 }
    };

    [HttpGet]
    public ActionResult<List<Item>> GetAll()
    {
        return Ok(_items);
    }

    [HttpGet("{code}")]
    public ActionResult<Item> GetByCode(string code)
    {
        var item = _items.FirstOrDefault(i => i.Code == code);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public ActionResult<Item> Create(Item item)
    {
        if (_items.Any(i => i.Code == item.Code))
            return BadRequest("Ürün kodu zaten mevcut.");
            
        item.Id = _items.Max(i => i.Id) + 1;
        _items.Add(item);
        return CreatedAtAction(nameof(GetByCode), new { code = item.Code }, item);
    }

    [HttpPut("{code}")]
    public ActionResult Update(string code, Item item)
    {
        var existing = _items.FirstOrDefault(i => i.Code == code);
        if (existing == null) return NotFound();

        existing.OnHand = item.OnHand;
        existing.LeadTimeDays = item.LeadTimeDays;
        existing.MinOrderQty = item.MinOrderQty;
        existing.SafetyStock = item.SafetyStock;
        
        return NoContent();
    }
}
