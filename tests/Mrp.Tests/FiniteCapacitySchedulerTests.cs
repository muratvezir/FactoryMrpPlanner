using Xunit;
using Factory.Optimization.Services;
using FluentAssertions;

namespace Mrp.Tests;

public class FiniteCapacitySchedulerTests
{
    [Fact]
    public void SmokeTest()
    {
        var s = new FiniteCapacityScheduler();
        s.Should().NotBeNull();
    }
}
