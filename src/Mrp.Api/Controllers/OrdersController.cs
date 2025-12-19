using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mrp.Core.Entities;
using Mrp.Infrastructure.Data;

namespace Mrp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly MrpDbContext _context;

    public OrdersController(MrpDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Demand>>> GetAll()
    {
        return Ok(await _context.Demands.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Demand>> Create(Demand order)
    {
        // Validasyon: Ürün kodu var mı?
        if (!await _context.Items.AnyAsync(i => i.Code == order.ItemCode))
             return BadRequest($"Ürün kodu bulunamadı: {order.ItemCode}");

        _context.Demands.Add(order);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), order);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var order = await _context.Demands.FindAsync(id);
        if (order == null) return NotFound();
        
        _context.Demands.Remove(order);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
