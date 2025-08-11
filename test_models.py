#!/usr/bin/env python3
"""
Test script to verify that pickle models can be loaded and used.
Run this to test your Python environment and model compatibility.
"""

import os
import pickle
from pathlib import Path

def test_model_loading():
    """Test loading a sample model."""
    models_dir = Path("models")
    
    if not models_dir.exists():
        print("❌ Models directory not found")
        return False
    
    # Find a sample model file
    model_files = list(models_dir.glob("job_forecasting_arima_*.pkl"))
    
    if not model_files:
        print("❌ No model files found in models directory")
        return False
    
    print(f"Found {len(model_files)} model files")
    
    # Try to load the first model
    sample_model = model_files[0]
    print(f"Testing model: {sample_model.name}")
    
    try:
        with open(sample_model, 'rb') as f:
            model = pickle.load(f)
        print(f"✅ Successfully loaded {sample_model.name}")
        print(f"Model type: {type(model)}")
        
        # Try to get some basic info about the model
        if hasattr(model, '__dict__'):
            print("Model attributes:", list(model.__dict__.keys())[:5])
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to load {sample_model.name}: {e}")
        return False

def test_prediction_script():
    """Test the prediction script."""
    print("\n" + "="*50)
    print("Testing prediction script...")
    
    try:
        # Try to run the prediction script
        import subprocess
        result = subprocess.run([
            'python3', 'predict_model.py', 'Technology', 'Entry-level'
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ Prediction script executed successfully")
            print("Sample output:", result.stdout[:200] + "..." if len(result.stdout) > 200 else result.stdout)
            return True
        else:
            print(f"❌ Prediction script failed with code {result.returncode}")
            print("Error:", result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Prediction script timed out")
        return False
    except Exception as e:
        print(f"❌ Error running prediction script: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Model Integration")
    print("="*50)
    
    # Test model loading
    model_test = test_model_loading()
    
    # Test prediction script
    script_test = test_prediction_script()
    
    print("\n" + "="*50)
    print("SUMMARY:")
    print(f"Model Loading: {'✅ PASS' if model_test else '❌ FAIL'}")
    print(f"Prediction Script: {'✅ PASS' if script_test else '❌ FAIL'}")
    
    if model_test and script_test:
        print("\n🎉 All tests passed! Your models should work with the web application.")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")
        print("You may need to install missing Python packages or check model compatibility.")
