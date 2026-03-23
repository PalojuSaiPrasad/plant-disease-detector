const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Placeholder)
// mongoose.connect('mongodb+srv://<username>:<password>@cluster0.mongodb.net/plant-disease?retryWrites=true&w=majority')
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('Plant Disease Detector API is running');
});

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Analyze Endpoint (Mock for now, would connect to Python/TF.js model)
app.post('/api/analyze', upload.single('image'), (req, res) => {
    // In a real scenario, we would pass req.file.path to the AI model here.

    // Mock Response
    res.json({
        success: true,
        data: {
            disease: "Tomato Early Blight",
            confidence: 94.5,
            status: "Infected",
            symptoms: [
                "Dark, concentric rings on older leaves",
                "Yellowing of tissue around spots",
                "Premature leaf drop"
            ],
            treatment: [
                "Remove and destroy infected leaves",
                "Apply copper-based fungicides",
                "Improve air circulation between plants"
            ]
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
