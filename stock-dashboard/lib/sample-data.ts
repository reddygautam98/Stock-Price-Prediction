// Generate sample data for the last 100 days
export function generateSampleData() {
  const data = []
  const basePrice = 100
  let currentPrice = basePrice

  for (let i = 0; i < 100; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (100 - i))

    // Generate random daily change between -3% and 3%
    const dailyChange = (Math.random() * 6 - 3) / 100
    currentPrice = currentPrice * (1 + dailyChange)

    // Calculate moving averages
    const ma20 = basePrice * (1 + Math.sin(i / 10) * 0.1)
    const ma50 = basePrice * (1 + Math.sin(i / 25) * 0.15)

    // Generate random volume ratio between 0.5 and 1.5
    const volumeRatio = 0.5 + Math.random()

    // Calculate daily range as percentage of price
    const dailyRange = currentPrice * (0.02 + Math.random() * 0.03)

    // Calculate price position within daily range (0-100%)
    const pricePosition = Math.random() * 100

    data.push({
      Date: date,
      Close: currentPrice,
      Daily_Return: dailyChange * 100, // Convert to percentage
      MA20: ma20,
      MA50: ma50,
      Volatility: Math.abs(dailyChange * 100), // Use absolute daily change as volatility
      Volume_Ratio: volumeRatio,
      Daily_Range_Pct: (dailyRange / currentPrice) * 100,
      Price_Position: pricePosition,
    })
  }

  return data
}

