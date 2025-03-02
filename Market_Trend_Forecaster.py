# Import required libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
import os
import warnings

warnings.filterwarnings('ignore')

# Set style for better visualizations
plt.style.use('seaborn')
sns.set_palette("husl")

# Define the file path
FILE_PATH = r"C:\Users\reddy\Downloads\Stock Price Prediction\stock_analysis.csv"
OUTPUT_DIR = r"C:\Users\reddy\Downloads\Stock Price Prediction"

def load_and_process_data(file_path):
    """Load and process the stock data"""
    try:
        df = pd.read_csv(file_path)
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)
        return df
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        raise
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        raise

def calculate_technical_indicators(df):
    """Calculate additional technical indicators"""
    # RSI
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # MACD
    exp1 = df['Close'].ewm(span=12, adjust=False).mean()
    exp2 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()
    
    # Bollinger Bands
    df['BB_middle'] = df['Close'].rolling(window=20).mean()
    df['BB_upper'] = df['BB_middle'] + 2*df['Close'].rolling(window=20).std()
    df['BB_lower'] = df['BB_middle'] - 2*df['Close'].rolling(window=20).std()
    
    return df

def prepare_prediction_data(df, lookback=60):
    """Prepare data for prediction model"""
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[['Close']])
    
    X, y = [], []
    for i in range(lookback, len(scaled_data)):
        X.append(scaled_data[i-lookback:i, 0])
        y.append(scaled_data[i, 0])
    
    X, y = np.array(X), np.array(y)
    
    return X, y, scaler

def predict_with_linear_regression(X, y):
    """Simple linear regression prediction"""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Reshape X for linear regression
    X_train_2d = X_train.reshape(X_train.shape[0], -1)
    X_test_2d = X_test.reshape(X_test.shape[0], -1)
    
    # Train and predict
    model = LinearRegression()
    model.fit(X_train_2d, y_train)
    y_pred = model.predict(X_test_2d)
    
    return y_test, y_pred

def plot_analysis(df):
    """Create comprehensive visualizations"""
    plt.figure(figsize=(20, 15))

    # Plot Closing Price
    plt.subplot(3, 1, 1)
    df['Close'].plot(label='Close Price', color='blue')
    plt.title('Stock Closing Price Over Time')
    plt.legend()
    
    # Plot RSI
    plt.subplot(3, 1, 2)
    df['RSI'].plot(color='purple')
    plt.axhline(70, linestyle='--', color='red', alpha=0.5)
    plt.axhline(30, linestyle='--', color='green', alpha=0.5)
    plt.title('Relative Strength Index (RSI)')
    
    # Plot MACD
    plt.subplot(3, 1, 3)
    df['MACD'].plot(label='MACD', color='blue')
    df['Signal_Line'].plot(label='Signal Line', color='red')
    plt.title('MACD Indicator')
    plt.legend()
    
    plt.tight_layout()
    
    output_path = os.path.join(OUTPUT_DIR, "stock_analysis.png")
    plt.savefig(output_path)
    plt.close()

def main():
    try:
        # Load and process data
        print(f"Loading data from: {FILE_PATH}")
        df = load_and_process_data(FILE_PATH)
        
        # Calculate technical indicators
        df = calculate_technical_indicators(df)
        
        # Prepare data for prediction
        X, y, scaler = prepare_prediction_data(df)
        
        # Make predictions using linear regression
        y_test, y_pred = predict_with_linear_regression(X, y)
        
        # Transform predictions back to original scale
        y_pred = scaler.inverse_transform(y_pred.reshape(-1, 1))
        y_test = scaler.inverse_transform(y_test.reshape(-1, 1))
        
        # Calculate prediction metrics
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        # Create visualizations
        plot_analysis(df)
        
        # Save results to CSV
        results = pd.DataFrame({
            'Metric': [
                'Prediction RMSE',
                'Prediction R2 Score'
            ],
            'Value': [
                rmse,
                r2
            ]
        })
        
        output_csv_path = os.path.join(OUTPUT_DIR, "analysis_results.csv")
        results.to_csv(output_csv_path, index=False)
        
        print("\nAnalysis completed successfully!")
        print(f"Results saved in: {OUTPUT_DIR}")
        print("Files generated:")
        print(f"1. {output_csv_path}")
        print(f"2. {os.path.join(OUTPUT_DIR, 'stock_analysis.png')}")
        
    except Exception as e:
        print(f"An error occurred during analysis: {str(e)}")

if __name__ == "__main__":
    main()
