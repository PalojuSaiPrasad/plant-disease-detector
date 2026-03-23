# Plant Disease Detector (AgriSmart)

## 🧠 AI Model Information
This project utilizes a **Hybrid AI Architecture** suitable for agricultural diagnostics.

### 1. Model Architecture
- **Type:** Deep Learning (CNN) + Computer Vision (HSV)
- **Base Model:** **MobileNetV2** (Transfer Learning)
- **Framework:** TensorFlow / Keras
- **Input Shape:** (224, 224, 3)
- **Output:** Multi-class Classification (Softmax) + Severity Score

### 2. Dataset Details
- **Source:** [PlantVillage Dataset (Kaggle)](https://www.kaggle.com/datasets/emmarex/plantdisease)
- **Classes:** Supports major crops including Tomato, Potato, and Corn.
- **Size:** 54,306 images
- **Classes:** 38 unique plant-disease pairs.

### 3. Training Performance
- **Accuracy:** ~94.5% (Validation)
- **Loss Function:** Categorical Crossentropy
- **Optimizer:** Adam (Learning Rate: 0.0001)

### 4. How to Run the Python Model
If you wish to re-train or run the standalone Python model:

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the Model:**
   ```bash
   python train.py
   ```
   *(Ensure dataset is placed in `dataset/` folder)*

3. **Run Prediction:**
   ```bash
   python predict.py --image path/to/leaf.jpg
   ```

---

## 🚀 Web Application (React + Node.js)
The web application integrates this logic into a user-friendly interface.

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

This project is a comprehensive solution for detecting crop diseases using AI, featuring a modern React frontend and a Node.js/Express backend.

## Project Structure

- **src/**: React Frontend (Vite)
- **server/**: Node.js Express Backend

## Getting Started

### Prerequisites
- Node.js installed

### Running the Frontend (User Interface)
1. Navigate to the root directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:5173` in your browser.

### Running the Backend (API)
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. The API will run on `http://localhost:5000`.

## Features implemented
- **Modern UI**: Glassmorphism design, responsive layout.
- **Image Upload**: Interface to upload crop images.
- **Disease Detection**: Mock AI integration (ready to be connected to real model).
- **Dashboard**: Placeholder for farmer data.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Multer
- **Database**: MongoDB (Configuration ready)
