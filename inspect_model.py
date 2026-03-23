import tensorflow as tf
from tensorflow.keras.models import load_model

# Path to the model
model_path = 'models/plant_disease_model.h5'

print(f"Loading model from {model_path}...")
try:
    # Load the binary file
    model = load_model(model_path)
    
    # Print the internal structure (layers, parameters)
    print("\n✅ SUCCESS: Model loaded correctly. Here is the internal architecture:\n")
    model.summary()
    
except Exception as e:
    print(f"❌ Error loading model: {e}")
