import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, Loader, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Analyze = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const imageRef = useRef(null);
    const [manualCrop, setManualCrop] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    // Helper to convert file to base64 for Gemini API
    const fileToGenerativePart = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Retrieve the API key from Vite environment variables
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            
            if (!apiKey) {
                setError("Configuration Error: Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
                setLoading(false);
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            
            // gemini-2.5-flash is fast and great for multimodal tasks like image analysis
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const imagePart = await fileToGenerativePart(image);
            
            const prompt = `
                You are a highly skilled plant pathology expert AI.
                Analyze this image of a plant ${manualCrop ? `(The user indicated this plant might be a ${manualCrop})` : ''}.
                Identify the crop name, and precisely diagnose any diseases, deficiencies, or pests present. Maintain a high standard of accuracy.
                
                Respond strictly in the following JSON format:
                {
                    "cropName": "Detected crop name",
                    "disease": "Name of the disease (or 'Healthy' if no issue)",
                    "status": "Healthy, Infected, or Critical",
                    "confidence": 95,
                    "infectionRatio": 0.25,
                    "severity": "Mild, Moderate, or Severe (or 'None' if healthy)",
                    "symptoms": ["Detailed symptom 1", "Detailed symptom 2"],
                    "treatment": ["treatment step 1", "treatment step 2"],
                    "preventive": ["preventive measure 1", "preventive measure 2"]
                }
                
                Rules:
                - The response MUST be pure valid JSON only. Do not wrap it in \`\`\`json markdown blocks or include any other human-readable text.
                - The "confidence" should be a number between 0 and 100 representing your certainty.
                - The "infectionRatio" should be a decimal between 0 and 1 predicting the percentage of leaf area affected (0 if healthy).
                - Even if the plant is healthy, provide generic symptom checks, maintenance care treatment, and preventive advice.
                - Do not hallucinate a disease if the plant looks perfectly healthy.
            `;

            // Call the LLM with the prompt and the image
            const resultPromise = await model.generateContent([prompt, imagePart]);
            const response = resultPromise.response;
            const textResponse = response.text();
            
            // Cleanup any potential markdown or extra text Gemini might return
            const cleanText = textResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
            const jsonResult = JSON.parse(cleanText);

            const newResult = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                confidence: typeof jsonResult.confidence === 'number' ? jsonResult.confidence.toFixed(1) : parseFloat(jsonResult.confidence || 0).toFixed(1),
                infectionRatio: jsonResult.infectionRatio || 0,
                severity: jsonResult.severity || "Unknown",
                disease: jsonResult.disease || "Unknown",
                status: jsonResult.status || "Unknown",
                symptoms: jsonResult.symptoms || [],
                treatment: jsonResult.treatment || [],
                preventive: jsonResult.preventive || [],
                cropName: jsonResult.cropName || "Unknown"
            };

            setResult(newResult);

            // Save to history
            const history = JSON.parse(localStorage.getItem('diseaseHistory') || '[]');
            localStorage.setItem('diseaseHistory', JSON.stringify([newResult, ...history]));

        } catch (err) {
            console.error("Analysis failed:", err);
            setError(err.message || "An error occurred during analysis by the LLM. Please try again or check your API key constraints.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px', maxWidth: '800px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>AI Crop Disease Analysis</h1>

            <div className="card glass" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>

                {!preview ? (
                    <div
                        style={{
                            border: '3px dashed var(--text-muted)',
                            borderRadius: '1rem',
                            padding: '4rem',
                            width: '100%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Upload size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Click to Upload Image</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Supported formats: JPG, PNG</p>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '1rem' }}>
                        <img
                            ref={imageRef}
                            src={preview}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            crossOrigin="anonymous"
                        />
                        <button
                            onClick={clearImage}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '50%'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>
                )}

                {preview && !result && !error && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select
                            className="input"
                            value={manualCrop}
                            onChange={(e) => setManualCrop(e.target.value)}
                            style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', fontSize: '1rem' }}
                        >
                            <option value="">🌱 Auto-Detect Plant (Gemini AI)</option>
                            <option disabled>--- Common Crops ---</option>
                            <option value="Tomato">🍅 Tomato</option>
                            <option value="Potato">🥔 Potato</option>
                            <option value="Corn">🌽 Corn (Maize)</option>
                            <option value="Rice">🌾 Rice</option>
                            <option value="Wheat">🌾 Wheat</option>
                            <option value="Apple">🍎 Apple</option>
                            <option value="Grape">🍇 Grape</option>
                            <option value="Strawberry">🍓 Strawberry</option>
                            <option value="Peach">🍑 Peach</option>
                            <option value="Guava">🍈 Guava</option>
                            <option value="Mango">🥭 Mango</option>
                            <option value="Pepper">🌶️ Pepper/Chili</option>
                            <option value="Cotton">🧶 Cotton</option>
                            <option value="Citrus">🍋 Citrus (Lemon/Orange)</option>
                            <option value="Tea">🍵 Tea</option>
                            <option value="Coffee">☕ Coffee</option>
                            <option value="Sugarcane">🎋 Sugarcane</option>
                            <option value="Brinjal">🍆 Brinjal (Eggplant)</option>
                            <option value="Cauliflower">🥦 Cauliflower</option>
                            <option disabled>--- Other ---</option>
                            <option value="Plant">🌿 Other Plant/Leaf</option>
                        </select>

                        <button
                            className="btn btn-primary"
                            onClick={handleAnalyze}
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                        >
                            {loading ? (
                                <span className="flex-center" style={{ gap: '0.5rem' }}>
                                    <Loader className="animate-spin" /> Analyzing with Gemini...
                                </span>
                            ) : (
                                "Analyze Crop Health"
                            )}
                        </button>
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: '#fee2e2',
                            color: '#ef4444',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%'
                        }}
                    >
                        <AlertOctagon size={24} style={{ minWidth: '24px' }}/>
                        <p style={{ fontWeight: '600' }}>{error}</p>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                        style={{ marginTop: '2rem', borderLeft: `6px solid ${result.status === 'Healthy' ? 'var(--primary)' : 'var(--accent)'}` }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Analyzed: {result.cropName}</h4>
                                <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{result.disease}</h2>
                                <span
                                    style={{
                                        background: result.status === 'Healthy' ? 'var(--primary)' : 'var(--accent)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {result.status}
                                </span>
                                {result.severity && result.severity !== "None" && result.status !== "Healthy" && (
                                    <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                                        Severity: <strong>{result.severity}</strong>
                                    </span>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{result.confidence}%</span>
                                <p style={{ color: 'var(--text-muted)' }}>Confidence</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Est. Infection Area: {(result.infectionRatio * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <AlertTriangle color={result.status === 'Healthy' ? 'var(--primary)' : 'var(--accent)'} /> Symptoms
                                </h3>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                                    {result.symptoms.map((s, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{s}</li>)}
                                </ul>
                            </div>

                            <div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <CheckCircle color="var(--primary)" /> Treatment
                                </h3>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                                    {result.treatment.map((t, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{t}</li>)}
                                </ul>
                            </div>
                            
                            {result.preventive && result.preventive.length > 0 && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <CheckCircle color="var(--primary)" /> Preventive Care
                                    </h3>
                                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)' }}>
                                        {result.preventive.map((p, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{p}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Analyze;
