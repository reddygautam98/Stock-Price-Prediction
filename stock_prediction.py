import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow import keras

# Load and preprocess data
def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    df = df.astype(float)
    
    # Calculate technical indicators
    df['MA_50'] = df['Close'].rolling(window=50).mean()
    df['MA_200'] = df['Close'].rolling(window=200).mean()
    
    # RSI
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    df.dropna(inplace=True)
    return df

# Prepare data for LSTM
def prepare_data_for_lstm(data, target_column, sequence_length):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length):
        X.append(scaled_data[i:(i + sequence_length)])
        y.append(scaled_data[i + sequence_length][data.columns.get_loc(target_column)])
    
    return np.array(X), np.array(y), scaler

# Build LSTM model
def build_lstm_model(input_shape):
    model = keras.models.Sequential([
        keras.layers.LSTM(50, return_sequences=True, input_shape=input_shape),
        keras.layers.Dropout(0.2),
        keras.layers.LSTM(50, return_sequences=False),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(25),
        keras.layers.Dense(1)
    ])
    model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='mean_squared_error')
    return model

# Main function
def main():
    # Load and preprocess data
    df = load_and_preprocess_data(r'C:\Users\reddy\Downloads\Stock Price Prediction\stock_analysis.csv')
    
    # Prepare data for LSTM
    sequence_length = 60
    X, y, scaler = prepare_data_for_lstm(df, 'Close', sequence_length)
    
    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Build and train the model
    model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
    history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1, verbose=1)
    
    # Make predictions
    train_predictions = model.predict(X_train)
    test_predictions = model.predict(X_test)
    
    # Inverse transform predictions
    train_predictions = scaler.inverse_transform(np.concatenate([train_predictions, np.zeros((len(train_predictions), df.shape[1]-1))], axis=1))[:, 0]
    test_predictions = scaler.inverse_transform(np.concatenate([test_predictions, np.zeros((len(test_predictions), df.shape[1]-1))], axis=1))[:, 0]
    
    # Visualize results
    plt.figure(figsize=(16,8))
    plt.plot(df.index[-len(test_predictions):], df['Close'].values[-len(test_predictions):], label='Actual')
    plt.plot(df.index[-len(test_predictions):], test_predictions, label='Predicted')
    plt.title('Stock Price Prediction')
    plt.xlabel('Date')
    plt.ylabel('Price')
    plt.legend()
    plt.savefig('stock_prediction_results.png')
    plt.close()
    
    # Print model performance
    mse = np.mean((test_predictions - df['Close'].values[-len(test_predictions):])**2)
    print(f"Mean Squared Error: {mse}")

    # Plot training history
    plt.figure(figsize=(12, 6))
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Training History')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig('training_history.png')
    plt.close()

if __name__ == "__main__":
    main()

