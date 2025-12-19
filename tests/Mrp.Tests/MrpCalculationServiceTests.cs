using Xunit;
using FluentAssertions;
using Mrp.Core.Entities;
using Mrp.Core.Enums;
using Mrp.Engine.Services;

namespace Mrp.Tests;

public class MrpCalculationServiceTests
{
    private readonly MrpCalculationService _sut = new();

    [Fact]
    public void Calculate_SingleItem_WithSufficientStock_ShouldNotCreateSuggestion()
    {
        // Arrange - 100 adet stok var, 50 adet talep
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 100, MinOrderQty = 10, SafetyStock = 0, LeadTimeDays = 7 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 50, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(14)), Type = DemandType.Order, SourceId = "SIP-001" }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert - Stok yeterli, öneri oluşmamalı
        result.Suggestions.Should().BeEmpty();
        result.Exceptions.Should().BeEmpty();
    }

    [Fact]
    public void Calculate_SingleItem_WithInsufficientStock_ShouldCreateSuggestion()
    {
        // Arrange - 30 stok, 100 talep
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 30, MinOrderQty = 50, SafetyStock = 10, LeadTimeDays = 7 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 100, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(14)), Type = DemandType.Order, SourceId = "SIP-001" }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert
        result.Suggestions.Should().HaveCount(1);
        var suggestion = result.Suggestions.First();
        suggestion.ItemCode.Should().Be("MAMUL-001");
        suggestion.Action.Should().Be(ActionType.Make); // Finished = Make
        suggestion.PeggingInfo.Should().Be("SIP-001");
    }

    [Fact]
    public void Calculate_LotSizing_ShouldRoundUpToMinOrderQty()
    {
        // Arrange - Net ihtiyaç 80, MinOrderQty 50 → 100 olmalı
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 0, MinOrderQty = 50, SafetyStock = 0, LeadTimeDays = 7 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 80, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(14)), Type = DemandType.Order }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert - 80 → 100 (2 x 50)
        result.Suggestions.Should().HaveCount(1);
        result.Suggestions.First().Quantity.Should().Be(100);
    }

    [Fact]
    public void Calculate_SafetyStock_ShouldBeConsidered()
    {
        // Arrange - 50 stok, 40 talep, 20 emniyet stoğu → Net ihtiyaç = 40 - 50 + 20 = 10
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 50, MinOrderQty = 10, SafetyStock = 20, LeadTimeDays = 7 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 40, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(14)), Type = DemandType.Order }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert - Emniyet stoğu için öneri oluşmalı
        result.Suggestions.Should().HaveCount(1);
        result.Suggestions.First().Quantity.Should().Be(10);
    }

    [Fact]
    public void Calculate_RawMaterial_ShouldCreateBuySuggestion()
    {
        // Arrange
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "HAMMADDE-001", Type = ItemType.RawMaterial, OnHand = 0, MinOrderQty = 100, SafetyStock = 0, LeadTimeDays = 14 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "HAMMADDE-001", Quantity = 50, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(21)), Type = DemandType.Order }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert - RawMaterial = Buy
        result.Suggestions.Should().HaveCount(1);
        result.Suggestions.First().Action.Should().Be(ActionType.Buy);
    }

    [Fact]
    public void Calculate_LateDemand_ShouldCreateException()
    {
        // Arrange - LeadTime 14 gün, talep 7 gün sonra → Geçmişte başlaması gerekir
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 0, MinOrderQty = 10, SafetyStock = 0, LeadTimeDays = 14 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 10, DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(7)), Type = DemandType.Order }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert
        result.Exceptions.Should().HaveCount(1);
        result.Exceptions.First().Type.Should().Be(ExceptionType.LateDemand);
    }

    [Fact]
    public void Calculate_BackwardScheduling_ShouldSetCorrectStartDate()
    {
        // Arrange - DueDate 21 gün sonra, LeadTime 7 gün → StartDate 14 gün sonra
        var dueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(21));
        var expectedStartDate = DateOnly.FromDateTime(DateTime.Today.AddDays(14));
        
        var input = new MrpInput
        {
            Items = new List<Item>
            {
                new() { Code = "MAMUL-001", Type = ItemType.Finished, OnHand = 0, MinOrderQty = 10, SafetyStock = 0, LeadTimeDays = 7 }
            },
            Demands = new List<Demand>
            {
                new() { ItemCode = "MAMUL-001", Quantity = 10, DueDate = dueDate, Type = DemandType.Order }
            }
        };

        // Act
        var result = _sut.Calculate(input);

        // Assert
        result.Suggestions.Should().HaveCount(1);
        result.Suggestions.First().StartDate.Should().Be(expectedStartDate);
        result.Suggestions.First().EndDate.Should().Be(dueDate);
    }
}
