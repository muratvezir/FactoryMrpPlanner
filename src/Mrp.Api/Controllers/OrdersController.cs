using Microsoft.AspNetCore.Mvc;
using Mrp.Core.Entities;

namespace Mrp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private static readonly List<Demand> _orders = new();

    [HttpGet]
    public ActionResult<List<Demand>> GetAll()
    {
        return Ok(_orders);
    }

    [HttpPost]
    public ActionResult<Demand> Create(Demand order)
    {
        order.Id = _orders.Any() ? _orders.Max(o => o.Id) + 1 : 1;
        _orders.Add(order);
        return CreatedAtAction(nameof(GetAll), order); // Basit return
    }
    
    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order == null) return NotFound();
        _orders.Remove(order);
        return NoContent();
    }
}
