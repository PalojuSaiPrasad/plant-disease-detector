import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, Loader, AlertOctagon, Download, ImagePlus, Leaf, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

/* ── confidence ring ── */
const ConfidenceRing = ({ value }) => {
  const r = 36, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(parseFloat(value) / 100, 0), 1);
  const color = pct >= 0.8 ? 'var(--primary)' : pct >= 0.5 ? 'var(--accent)' : '#ef4444';
  return (
    <div style={{ position: 'relative', width: '90px', height: '90px' }}>
      <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="45" cy="45" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <motion.circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }} transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: '800', color }}>{value}%</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONF.</span>
      </div>
    </div>
  );
};

/* ── infection progress bar ── */
const InfectionBar = ({ ratio, label }) => {
  const pct = (ratio * 100).toFixed(1);
  const color = ratio < 0.2 ? 'var(--primary)' : ratio < 0.5 ? 'var(--accent)' : '#ef4444';
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
        <span>{label || 'Infection Area'}</span><span style={{ fontWeight: '700', color }}>{pct}%</span>
      </div>
      <div style={{ height: '8px', borderRadius: '99px', background: '#e5e7eb', overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', borderRadius: '99px', background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
      </div>
    </div>
  );
};

/* ── loading steps ── */
const loadingSteps = ['Uploading image…', 'Running AI analysis…', 'Detecting disease patterns…', 'Generating report…'];

/* ── supported languages ── */
const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English',         name: 'English' },
  { code: 'hi', label: '🇮🇳 Hindi (हिन्दी)',    name: 'Hindi' },
  { code: 'te', label: '🇮🇳 Telugu (తెలుగు)',  name: 'Telugu' },
  { code: 'ta', label: '🇮🇳 Tamil (தமிழ்)',    name: 'Tamil' },
  { code: 'kn', label: '🇮🇳 Kannada (ಕನ್ನಡ)', name: 'Kannada' },
  { code: 'ml', label: '🇮🇳 Malayalam (മലയാളം)', name: 'Malayalam' },
  { code: 'mr', label: '🇮🇳 Marathi (मराठी)',  name: 'Marathi' },
  { code: 'bn', label: '🇮🇳 Bengali (বাংলা)',  name: 'Bengali' },
  { code: 'gu', label: '🇮🇳 Gujarati (ગુજરાતી)', name: 'Gujarati' },
  { code: 'pa', label: '🇮🇳 Punjabi (ਪੰਜਾਬੀ)', name: 'Punjabi' },
  { code: 'or', label: '🇮🇳 Odia (ଓଡ଼ିଆ)',    name: 'Odia' },
  { code: 'ur', label: '🇮🇳 Urdu (اردو)',      name: 'Urdu' },
];

const Analyze = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [manualCrop, setManualCrop] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(null);
  const imageRef = useRef(null);

  const applyFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); setError(null); setTranslated(null);
  };

  const handleImageChange = (e) => applyFile(e.target.files[0]);
  const clearImage = () => { setImage(null); setPreview(null); setResult(null); setError(null); setTranslated(null); };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) applyFile(file);
  }, []);

  const fileToGenerativePart = async (file) => {
    const b64 = await new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return { inlineData: { data: b64, mimeType: file.type } };
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true); setError(null); setResult(null); setLoadStep(0); setTranslated(null);

    const stepTimer = setInterval(() => setLoadStep(s => Math.min(s + 1, loadingSteps.length - 1)), 700);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) { setError('Configuration Error: Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.'); return; }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const imagePart = await fileToGenerativePart(image);

      const prompt = `
        You are a highly skilled plant pathology and agronomy expert AI.
        Analyze this image ${manualCrop ? `(The user indicated this might be a ${manualCrop})` : ''}.
        First, determine if the image actually contains a plant or leaf.
        If the image does NOT contain any plant, crop, or leaf, respond with:
        { "isPlant": false }
        If the image contains a plant or leaf, respond strictly in the following JSON format:
        {
          "isPlant": true,
          "cropName": "Detected crop name",
          "disease": "Name of the disease or 'Healthy Plant' if no disease found",
          "status": "Healthy, Infected, or Critical",
          "confidence": 95,
          "infectionRatio": 0.0,
          "severity": "Mild, Moderate, or Severe (use 'None' if healthy)",
          "symptoms": ["For HEALTHY plants: list 3-4 visible positive health indicators you observe (e.g. vibrant green color, no lesions, firm texture, healthy venation). For DISEASED plants: describe disease symptoms."],
          "treatment": ["For HEALTHY plants: provide 3-4 specific care tips to maintain and boost this plant's health (e.g. watering schedule, fertilizer recommendations, pruning tips). For DISEASED plants: list treatment steps."],
          "preventive": ["Always provide 4-5 best practice preventive care measures specific to this crop type to prevent future issues (e.g. crop rotation, pest monitoring, soil health, irrigation tips)"]
        }
        Rules:
        - The response MUST be pure valid JSON only. No markdown code blocks.
        - confidence: number 0-100. infectionRatio: decimal 0-1 (use 0.0 for healthy plants).
        - For HEALTHY plants, symptoms/treatment/preventive arrays MUST always be filled with rich, meaningful content — never empty.
        - Do not hallucinate a disease if the plant looks healthy.
        - If no plant is visible, ONLY return { "isPlant": false } and nothing else.
      `;

      const res = await model.generateContent([prompt, imagePart]);
      const cleanText = res.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
      const json = JSON.parse(cleanText);

      if (json.isPlant === false) {
        setError('No plant or leaf detected in the uploaded image. Please upload a clear photo of a plant leaf.');
        return;
      }

      const newResult = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        confidence: typeof json.confidence === 'number' ? json.confidence.toFixed(1) : parseFloat(json.confidence || 0).toFixed(1),
        infectionRatio: json.infectionRatio || 0,
        severity: json.severity || 'Unknown',
        disease: json.disease || 'Unknown',
        status: json.status || 'Unknown',
        symptoms: json.symptoms || [],
        treatment: json.treatment || [],
        preventive: json.preventive || [],
        cropName: json.cropName || 'Unknown',
      };
      setResult(newResult);
      const history = JSON.parse(localStorage.getItem('diseaseHistory') || '[]');
      localStorage.setItem('diseaseHistory', JSON.stringify([newResult, ...history]));
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis failed. Check your API key or try again.');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  /* ── Translate results using Gemini ── */
  const handleTranslate = async () => {
    if (!result || selectedLang === 'en') { setTranslated(null); return; }
    setTranslating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const langName = LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang;

      const dataToTranslate = {
        cropName: result.cropName,
        disease: result.disease,
        status: result.status,
        severity: result.severity,
        symptomsLabel: 'Symptoms',
        treatmentLabel: 'Treatment',
        preventiveLabel: 'Preventive Care',
        infectionLabel: 'Infection Area',
        severityLabel: 'Severity',
        symptoms: result.symptoms,
        treatment: result.treatment,
        preventive: result.preventive,
      };

      const prompt = 'You are a professional agricultural translator.\n'
        + 'Translate ALL the field values in the following JSON from English into ' + langName + '.\n'
        + 'Translate EVERY string value including every item inside symptoms, treatment, and preventive arrays.\n'
        + 'Keep translations farmer-friendly and accurate.\n'
        + 'Return ONLY the translated JSON with the same structure. No extra text, no markdown.\n\n'
        + JSON.stringify(dataToTranslate, null, 2);

      const res = await model.generateContent(prompt);
      const cleanText = res.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
      const json = JSON.parse(cleanText);

      if (!Array.isArray(json.symptoms)) json.symptoms = result.symptoms;
      if (!Array.isArray(json.treatment)) json.treatment = result.treatment;
      if (!Array.isArray(json.preventive)) json.preventive = result.preventive;

      setTranslated(json);
    } catch (err) {
      console.error('Translation failed:', err);
      alert('Translation failed. Please try again.');
      setTranslated(null);
    } finally {
      setTranslating(false);
    }
  };

  const displayResult = translated ? { ...result, ...translated } : result;

  const downloadReport = () => {
    if (!result) return;
    const d = displayResult;
    const isHealthy = result.status === 'Healthy';
    const lines = [
      `AgriSmart Plant Health Report`,
      `==============================`,
      `Date       : ${result.date} ${result.time}`,
      `Crop       : ${d.cropName}`,
      `Status     : ${d.disease} (${d.status})`,
      `Confidence : ${result.confidence}%`,
      `Severity   : ${d.severity}`,
      isHealthy ? `` : `Infection  : ${(result.infectionRatio * 100).toFixed(1)}%`,
      ``,
      isHealthy ? `Health Observations:` : `Symptoms:`,
      ...d.symptoms.map(s => `  • ${s}`),
      ``,
      isHealthy ? `Care Tips:` : `Treatment:`,
      ...d.treatment.map(t => `  • ${t}`),
      ``,
      isHealthy ? `Preventive Best Practices:` : `Preventive Care:`,
      ...d.preventive.map(p => `  • ${p}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrismart-report-${result.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const statusColor = result ? (result.status === 'Healthy' ? 'var(--primary)' : result.status === 'Critical' ? '#ef4444' : 'var(--accent)') : 'var(--primary)';

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '820px' }}>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>AI Crop Disease Analysis</h1>
        <p style={{ color: 'var(--text-muted)' }}>Upload a plant image and get an expert AI diagnosis instantly.</p>
      </div>

      {/* ── Upload zone ── */}
      <div className="card glass" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>

        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              border: `3px dashed ${dragging ? 'var(--primary)' : 'var(--text-muted)'}`,
              borderRadius: '1rem', padding: '4rem 2rem', width: '100%', textAlign: 'center', cursor: 'pointer',
              background: dragging ? 'rgba(16,185,129,0.05)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <ImagePlus size={36} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Drag & Drop or Click to Upload</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports JPG, PNG, WEBP · Max 10 MB</p>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', borderRadius: '1rem', overflow: 'hidden', maxHeight: '380px' }}>
            <img ref={imageRef} src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
            <button onClick={clearImage} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.55)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
              <X size={22} />
            </button>
          </div>
        )}

        {/* crop selector + analyze */}
        {preview && !result && !error && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select value={manualCrop} onChange={(e) => setManualCrop(e.target.value)}
              style={{ padding: '0.9rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.95rem', width: '100%' }}>
              <option value="">🌱 Auto-Detect Plant (Gemini AI)</option>
              <option disabled>--- Common Crops ---</option>
              {[['Tomato', '🍅'], ['Potato', '🥔'], ['Corn', '🌽'], ['Rice', '🌾'], ['Wheat', '🌾'], ['Apple', '🍎'], ['Grape', '🍇'], ['Strawberry', '🍓'], ['Peach', '🍑'], ['Guava', '🍈'], ['Mango', '🥭'], ['Pepper', '🌶️'], ['Cotton', '🧶'], ['Citrus', '🍋'], ['Tea', '🍵'], ['Coffee', '☕'], ['Sugarcane', '🎋'], ['Brinjal', '🍆'], ['Cauliflower', '🥦']]
                .map(([v, e]) => <option key={v} value={v}>{e} {v}</option>)}
              <option disabled>--- Other ---</option>
              <option value="Plant">🌿 Other Plant / Leaf</option>
            </select>

            <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', gap: '0.6rem' }}>
              {loading ? (
                <span className="flex-center" style={{ gap: '0.75rem' }}>
                  <Loader className="animate-spin" size={20} />
                  <span style={{ opacity: 0.9 }}>{loadingSteps[loadStep]}</span>
                </span>
              ) : (
                <><Leaf size={20} /> Analyze Crop Health</>
              )}
            </button>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
            <AlertOctagon size={22} style={{ minWidth: 22, marginTop: 2 }} />
            <p style={{ fontWeight: '600', lineHeight: 1.5 }}>{error}</p>
          </motion.div>
        )}
      </div>

      {/* ── Result Card ── */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="card" style={{ marginTop: '2rem', borderLeft: `6px solid ${statusColor}` }}>

            {/* header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                  🌿 {displayResult.cropName} · {result.date} {result.time}
                </p>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '0.6rem' }}>{displayResult.disease}</h2>
                <span style={{ background: statusColor, color: 'white', padding: '0.25rem 0.9rem', borderRadius: '1rem', fontSize: '0.88rem', fontWeight: 'bold' }}>
                  {displayResult.status}
                </span>
                {displayResult.severity && displayResult.severity !== 'None' && result.status !== 'Healthy' && (
                  <span style={{ marginLeft: '0.6rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {displayResult.severityLabel || 'Severity'}: <strong>{displayResult.severity}</strong>
                  </span>
                )}
              </div>
              <ConfidenceRing value={result.confidence} />
            </div>

            <InfectionBar ratio={result.infectionRatio} label={displayResult.infectionLabel} />

            {/* ── Language Translator ── */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.06)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Globe size={18} color="var(--primary)" />
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>Translate Results</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· Get results in your language</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={selectedLang}
                  onChange={(e) => { setSelectedLang(e.target.value); setTranslated(null); }}
                  style={{ flex: 1, minWidth: '180px', padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'var(--background)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleTranslate}
                  disabled={translating || selectedLang === 'en'}
                  className="btn btn-primary"
                  style={{ padding: '0.7rem 1.4rem', fontSize: '0.92rem', gap: '0.5rem', opacity: selectedLang === 'en' ? 0.5 : 1 }}
                >
                  {translating ? (
                    <span className="flex-center" style={{ gap: '0.5rem' }}>
                      <Loader className="animate-spin" size={16} /> Translating…
                    </span>
                  ) : (
                    <><Globe size={16} /> Translate</>
                  )}
                </button>
                {translated && (
                  <button onClick={() => { setTranslated(null); setSelectedLang('en'); }}
                    style={{ padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
                    Reset to English
                  </button>
                )}
              </div>
              {translated && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  ✅ Results translated to {LANGUAGES.find(l => l.code === selectedLang)?.label}
                </motion.p>
              )}
            </div>

            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--glass-border)' }} />

            {/* detail grid */}
            {(() => {
              const isHealthy = result.status === 'Healthy';
              const symptomsLabel = displayResult.symptomsLabel || (isHealthy ? '🌿 Health Observations' : '⚠️ Symptoms');
              const treatmentLabel = displayResult.treatmentLabel || (isHealthy ? '💧 Care Tips' : '💊 Treatment');
              const preventiveLabel = displayResult.preventiveLabel || (isHealthy ? '🛡️ Preventive Best Practices' : '🛡️ Preventive Care');
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                      {isHealthy
                        ? <CheckCircle size={18} color="var(--primary)" />
                        : <AlertTriangle size={18} color={statusColor} />}
                      {symptomsLabel}
                    </h3>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                      {displayResult.symptoms.length > 0
                        ? displayResult.symptoms.map((s, i) => <li key={i}>{s}</li>)
                        : <li style={{ color: 'var(--primary)' }}>No issues detected — plant appears healthy!</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                      <CheckCircle size={18} color="var(--primary)" /> {treatmentLabel}
                    </h3>
                    <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                      {displayResult.treatment.length > 0
                        ? displayResult.treatment.map((t, i) => <li key={i}>{t}</li>)
                        : <li style={{ color: 'var(--primary)' }}>Continue current care routine to maintain plant health.</li>}
                    </ul>
                  </div>
                  {displayResult.preventive?.length > 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                        <CheckCircle size={18} color="var(--secondary)" /> {preventiveLabel}
                      </h3>
                      <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', columns: 2 }}>
                        {displayResult.preventive.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* download */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={downloadReport} className="btn btn-outline" style={{ gap: '0.5rem', fontSize: '0.9rem' }}>
                <Download size={16} /> Download Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analyze;
