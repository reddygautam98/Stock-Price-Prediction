-- Create table for stock data
CREATE TABLE stock_data (
    Date DATE PRIMARY KEY,
    Close FLOAT,
    Daily_Return FLOAT,
    MA20 FLOAT,
    MA50 FLOAT,
    Volatility FLOAT,
    Volume_Ratio FLOAT,
    Daily_Range_Pct FLOAT,
    Price_Position FLOAT
);

-- Load data from CSV file
COPY stock_data FROM 'C:\Users\reddy\Downloads\Stock Price Prediction\stock-dashboard\public\stock_analysis.csv' 
DELIMITER ',' CSV HEADER;

-- Calculate average daily returns and standard deviation
SELECT 
    AVG(Daily_Return) AS Avg_Daily_Return, 
    STDDEV(Daily_Return) AS StdDev_Daily_Return
FROM stock_data;

-- Volume analysis and correlation with price
SELECT 
    CORR(Close, Volume_Ratio) AS Correlation_Close_Volume
FROM stock_data;

-- Maximum drawdown calculation
WITH drawdowns AS (
    SELECT 
        Date, 
        Close,
        MAX(Close) OVER (ORDER BY Date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Peak,
        (Close - MAX(Close) OVER (ORDER BY Date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) / MAX(Close) OVER (ORDER BY Date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS Drawdown
    FROM stock_data
)
SELECT MIN(Drawdown) AS Max_Drawdown FROM drawdowns;

-- Price position and daily range analysis
SELECT 
    AVG(Price_Position) AS Avg_Price_Position, 
    AVG(Daily_Range_Pct) AS Avg_Daily_Range
FROM stock_data;

-- Price trends with moving averages
SELECT 
    Date, 
    Close, 
    MA20, 
    MA50, 
    CASE 
        WHEN MA20 > MA50 THEN 'Uptrend'
        WHEN MA20 < MA50 THEN 'Downtrend'
        ELSE 'Neutral'
    END AS Trend
FROM stock_data;

-- Daily returns distribution
SELECT 
    Daily_Return, 
    COUNT(*) AS Frequency
FROM stock_data
GROUP BY Daily_Return
ORDER BY Daily_Return;

-- Volatility analysis
SELECT 
    AVG(Volatility) AS Avg_Volatility, 
    MAX(Volatility) AS Max_Volatility, 
    MIN(Volatility) AS Min_Volatility
FROM stock_data;

-- Volume ratio analysis
SELECT 
    AVG(Volume_Ratio) AS Avg_Volume_Ratio, 
    MAX(Volume_Ratio) AS Max_Volume_Ratio, 
    MIN(Volume_Ratio) AS Min_Volume_Ratio
FROM stock_data;

-- Price position vs daily range
SELECT 
    CORR(Price_Position, Daily_Range_Pct) AS Correlation_Price_Daily_Range
FROM stock_data;
