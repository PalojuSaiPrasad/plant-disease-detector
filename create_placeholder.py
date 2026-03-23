import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Input
from tensorflow.keras.applications import MobileNetV2
import json
import os

def create_placeholder_model():
    print("Creating placeholder model structure...")
    
    # 1. Create a simple valid model architecture (MobileNetV2 based)
    # We use random weights instead of training since we don't have the dataset yet.
    # This allows the system to 'run' for demonstration purposes.
    base_model = MobileNetV2(weights=None, include_top=False, input_shape=(224, 224, 3))
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(15, activation='softmax')(x) # 15 dummy classes

    model = Model(inputs=base_model.input, outputs=predictions)
    
    # 2. Save the model file
    if not os.path.exists('models'):
        os.makedirs('models')
        
    model.save('models/plant_disease_model.h5')
    print("✓ Created models/plant_disease_model.h5")

    # 3. Create class indices
    class_indices = {
        "Apple___Apple_scab": 0,
        "Apple___Black_rot": 1,
        "Apple___Cedar_apple_rust": 2,
        "Apple___healthy": 3,
        "Corn_(maize)___Cercospora_leaf_spot": 4,
        "Corn_(maize)___Common_rust_": 5,
        "Corn_(maize)___Northern_Leaf_Blight": 6,
        "Corn_(maize)___healthy": 7,
        "Grape___Black_rot": 8,
        "Grape___Esca_(Black_Measles)": 9,
        "Grape___healthy": 10,
        "Potato___Early_blight": 11,
        "Potato___Late_blight": 12,
        "Potato___healthy": 13,
        "Tomato___Target_Spot": 14
    }
    
    with open('models/class_indices.json', 'w') as f:
        json.dump(class_indices, f)
    print("✓ Created models/class_indices.json")
    print("\nSUCCESS: Placeholder files created. You can now run predict.py!")

if __name__ == "__main__":
    create_placeholder_model()
