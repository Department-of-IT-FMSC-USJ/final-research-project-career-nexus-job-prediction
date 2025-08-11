#!/usr/bin/env python3
"""
Script to convert pickle models to JSON format for web application usage.
This script reads the ARIMA model files and extracts forecast data.

Note: This script requires the same Python environment and libraries 
that were used to create the original models.
"""

import os
import pickle
import json
import pandas as pd
from pathlib import Path

def load_pickle_model(file_path):
    """Load a pickle file safely."""
    try:
        with open(file_path, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def extract_forecast_data(model, periods=24):
    """Extract forecast data from ARIMA model."""
    try:
        # This would depend on your specific model structure
        # Common methods for ARIMA models:
        if hasattr(model, 'forecast'):
            forecast = model.forecast(steps=periods)
        elif hasattr(model, 'predict'):
            forecast = model.predict(n_periods=periods)
        else:
            # If it's a fitted model result, try to get forecasts
            forecast = model.forecast(periods)
        
        return forecast.tolist() if hasattr(forecast, 'tolist') else list(forecast)
    except Exception as e:
        print(f"Error extracting forecast: {e}")
        return None

def convert_models_to_json():
    """Convert all pickle models to JSON format."""
    models_dir = Path('./models')
    output_dir = Path('./public/models')
    output_dir.mkdir(exist_ok=True)
    
    model_files = list(models_dir.glob('job_forecasting_arima_*.pkl'))
    
    for model_file in model_files:
        print(f"Processing {model_file.name}...")
        
        # Extract industry and experience from filename
        parts = model_file.stem.split('_')
        if len(parts) >= 4:
            industry = parts[3]
            experience = '_'.join(parts[4:])
        else:
            continue
        
        # Load the model
        model = load_pickle_model(model_file)
        if model is None:
            continue
        
        # Extract forecast data
        forecast_data = extract_forecast_data(model)
        if forecast_data is None:
            continue
        
        # Create JSON structure
        output_data = {
            'industry': industry,
            'experience': experience,
            'forecast_periods': 24,
            'predictions': [
                {
                    'month': i + 1,
                    'period': f"Month {i + 1}",
                    'demand': round(value, 2)
                }
                for i, value in enumerate(forecast_data[:24])
            ],
            'metadata': {
                'model_type': 'ARIMA',
                'created_from': model_file.name
            }
        }
        
        # Save to JSON file
        output_file = output_dir / f"{industry}_{experience}.json"
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        print(f"Saved {output_file}")

def convert_time_series_data():
    """Convert the time series data file if it exists."""
    ts_file = Path('./models/job_forecasting_ts_data.pkl')
    if ts_file.exists():
        print(f"Processing {ts_file.name}...")
        
        data = load_pickle_model(ts_file)
        if data is not None:
            # Convert to JSON-serializable format
            if isinstance(data, pd.DataFrame):
                output_data = {
                    'data': data.to_dict('records'),
                    'columns': list(data.columns),
                    'index': data.index.tolist() if hasattr(data.index, 'tolist') else None
                }
            else:
                output_data = {'data': data}
            
            output_file = Path('./public/models/time_series_data.json')
            with open(output_file, 'w') as f:
                json.dump(output_data, f, indent=2)
            
            print(f"Saved time series data to {output_file}")

if __name__ == "__main__":
    print("Converting pickle models to JSON format...")
    print("Note: This script requires the same Python environment used to create the models.")
    print()
    
    convert_models_to_json()
    convert_time_series_data()
    
    print()
    print("Conversion complete!")
    print("JSON files are saved in ./public/models/ directory")
    print("The web application can now load these JSON files directly.")
