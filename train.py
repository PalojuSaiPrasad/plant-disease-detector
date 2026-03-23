import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import os

# ===========================
# CONFIGURATION
# ===========================
DATASET_DIR = "dataset/plantvillage" # Adjust based on your extracted folder
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20 # Increased for better convergence
LEARNING_RATE = 0.0001
NUM_CLASSES = 15 # Change based on your dataset subset (e.g. Potato, Tomato, Corn)

def train_model():
    print("Checking dataset...")
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset not found at {DATASET_DIR}")
        print("Please download PlantVillage dataset and update path.")
        return

    # 1. Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        zoom_range=0.15,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        horizontal_flip=True,
        fill_mode="nearest",
        validation_split=0.2
    )

    print("Loading data...")
    train_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # 2. Build Model (Transfer Learning with MobileNetV2)
    print("Building MobileNetV2 model...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze base model layers
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(train_generator.num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    # 3. Compile
    model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    model.summary()

    # 4. Train (Phase 1: Top Layers)
    print(f"Starting Phase 1 Training (Top Layers) for {EPOCHS} epochs...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=val_generator,
        validation_steps=val_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    # ===========================
    # PHASE 2: FINE-TUNING
    # ===========================
    print("\nStarting Phase 2: Fine-Tuning...")
    
    # Unfreeze the base model
    base_model.trainable = True

    # Freeze almost everything, only unfreeze the bottom 40 layers of MobileNetV2
    # MobileNetV2 has 154 layers total.
    print("Unfreezing last 40 layers of MobileNetV2...")
    for layer in base_model.layers[:-40]:
        layer.trainable = False

    # Re-compile with a much lower learning rate to prevent destroying weights
    model.compile(optimizer=Adam(learning_rate=1e-5),  # Low Learning Rate
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    FINE_TUNE_EPOCHS = 10
    total_epochs = EPOCHS + FINE_TUNE_EPOCHS

    print(f"Continuing training for another {FINE_TUNE_EPOCHS} epochs...")
    history_fine = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=val_generator,
        validation_steps=val_generator.samples // BATCH_SIZE,
        initial_epoch=history.epoch[-1],
        epochs=total_epochs
    )

    # 5. Save Model
    if not os.path.exists('models'):
        os.makedirs('models')
    
    save_path = 'models/plant_disease_model.h5'
    model.save(save_path)
    print(f"Model saved successfully to {save_path}")

    # Save Class Indices (Mapping)
    with open('models/class_indices.json', 'w') as f:
        import json
        f.write(json.dumps(train_generator.class_indices))
    print("Class indices saved.")

if __name__ == "__main__":
    train_model()
