using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mrp.Core.Entities;
using Mrp.Core.Enums;
using Mrp.Infrastructure.Data;

namespace Mrp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly MrpDbContext _context;

    public MaterialsController(MrpDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Item>>> GetAll()
    {
        return Ok(await _context.Items.ToListAsync());
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<Item>> GetByCode(string code)
    {
        var item = await _context.Items.FirstOrDefaultAsync(i => i.Code == code);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<Item>> Create(Item item)
    {
        if (await _context.Items.AnyAsync(i => i.Code == item.Code))
            return BadRequest("Ürün kodu zaten mevcut.");
            
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByCode), new { code = item.Code }, item);
    }

    [HttpPut("{code}")]
    public async Task<ActionResult> Update(string code, Item item)
    {
        var existing = await _context.Items.FirstOrDefaultAsync(i => i.Code == code);
        if (existing == null) return NotFound();

        existing.OnHand = item.OnHand;
        existing.LeadTimeDays = item.LeadTimeDays;
        existing.MinOrderQty = item.MinOrderQty;
        existing.SafetyStock = item.SafetyStock;
        existing.Type = item.Type; 
        
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
