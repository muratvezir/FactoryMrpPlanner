using Microsoft.EntityFrameworkCore;
using Mrp.Core.Entities;

namespace Mrp.Infrastructure.Data;

public class MrpDbContext : DbContext
{
    public MrpDbContext(DbContextOptions<MrpDbContext> options) : base(options)
    {
    }

    public DbSet<Item> Items { get; set; }
    public DbSet<Demand> Demands { get; set; }
    public DbSet<BomLine> BomLines { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Item
        modelBuilder.Entity<Item>()
            .HasKey(i => i.Id);
            
        modelBuilder.Entity<Item>()
            .Property(i => i.Code)
            .IsRequired()
            .HasMaxLength(50);
            
        modelBuilder.Entity<Item>()
            .HasIndex(i => i.Code)
            .IsUnique();

        // Demand
        modelBuilder.Entity<Demand>()
            .HasKey(d => d.Id);

        // BomLine
        modelBuilder.Entity<BomLine>()
            .HasKey(b => b.Id);
            
        // İlişkileri açıkça tanımlamadık (Code üzerinden lookup yapacağız)
        // Çünkü MRP motoru hızlı olması için Dictionary/Graph kullanıyor.
        // EF Core ilişkisi kurarsak Lazy Loading vs. karmaşası olabilir.
    }
}
