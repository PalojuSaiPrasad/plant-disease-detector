import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.preprocessing import image
import numpy as np
import json
import os
import argparse

# ===========================
# CONFIGURATION
# ===========================
MODEL_PATH = "models/plant_disease_model.h5"
INDICES_PATH = "models/class_indices.json"


def predict_image(image_path):
    # 1. Load Model
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file not found at {MODEL_PATH}")
        print("Run train.py first or place a trained .h5 file there.")
        return


    print("Loading model...")
    model = load_model(MODEL_PATH)


    # 2. Load Class Labels
    labels = {}
    if os.path.exists(INDICES_PATH):
        with open(INDICES_PATH, 'r') as f:
            indices = json.load(f)
            labels = {v: k for k, v in indices.items()} # Invert dict
    else:
        print("Warning: class_indices.json not found. Returning raw ID.")


    # 3. Preprocess Image
    print(f"Processing image: {image_path}")
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
    img_array /= 255.0 # Normalize


    # 4. Predict
    predictions = model.predict(img_array)
    predicted_class_idx = np.argmax(predictions[0])
    confidence = predictions[0][predicted_class_idx]


    label = labels.get(predicted_class_idx, f"Class {predicted_class_idx}")


    # 5. Output Results
    print("\n" + "="*30)
    print("      PREDICTION RESULT      ")
    print("="*30)
    print(f"Prediction: {label}")
    print(f"Confidence: {confidence*100:.2f}%")
    print("="*30 + "\n")


    return label, confidence


if __name__ == "__main__":
    # Allow command line usage: python predict.py --image path/to/leaf.jpg
    parser = argparse.ArgumentParser(description="Predict crop disease from image")
    parser.add_argument("--image", type=str, help="Path to the image file", required=False)
    
    args = parser.parse_args()
    
    if args.image:
        predict_image(args.image)
    else:
        print("Usage: python predict.py --image <path_to_image>")



