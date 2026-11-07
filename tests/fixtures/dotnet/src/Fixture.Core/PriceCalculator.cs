namespace Fixture.Core;

/// <summary>Applies a percentage discount to a price.</summary>
public static class PriceCalculator
{
    public static decimal ApplyDiscount(decimal price, decimal percent)
    {
        if (price < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(price), "Price cannot be negative.");
        }

        if (percent is < 0 or > 100)
        {
            throw new ArgumentOutOfRangeException(nameof(percent), "Discount must be between 0 and 100.");
        }

        return decimal.Round(price * (100 - percent) / 100, 2);
    }
}
