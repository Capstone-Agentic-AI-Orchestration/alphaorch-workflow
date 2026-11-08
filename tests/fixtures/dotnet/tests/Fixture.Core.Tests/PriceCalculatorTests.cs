using Fixture.Core;

namespace Fixture.Core.Tests;

public class PriceCalculatorTests
{
    [Theory]
    [InlineData(100, 0, 100)]
    [InlineData(100, 25, 75)]
    [InlineData(19.99, 10, 17.99)]
    public void ApplyDiscount_ReturnsDiscountedPrice(decimal price, decimal percent, decimal expected)
    {
        Assert.Equal(expected, PriceCalculator.ApplyDiscount(price, percent));
    }

    [Fact]
    public void ApplyDiscount_RejectsNegativePrice()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => PriceCalculator.ApplyDiscount(-1, 10));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public void ApplyDiscount_RejectsOutOfRangePercent(decimal percent)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => PriceCalculator.ApplyDiscount(10, percent));
    }
}
