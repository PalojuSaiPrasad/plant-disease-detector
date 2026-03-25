import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Eye, Lock, Leaf, Github, Mail } from 'lucide-react';

const techStack = [
  { icon: <Leaf size={28} color="var(--primary)" />, name: 'React + Vite', desc: 'Fast, modern frontend framework for a smooth single-page experience.' },
  { icon: <Cpu size={28} color="var(--secondary)" />, name: 'Google Gemini AI', desc: 'Multimodal large language model powering our image analysis and diagnosis engine.' },
  { icon: <Eye size={28} color="var(--primary)" />, name: 'MobileNet V2 (CNN)', desc: 'Pre-trained convolutional neural network for efficient plant image classification.' },
  { icon: <Lock size={28} color="var(--accent)" />, name: 'Local-First Privacy', desc: 'All analysis runs client-side. No images are ever uploaded to a third-party server.' },
];

const timeline = [
  { year: '2024', title: 'Project Started', desc: 'Research on plant diseases and AI-based detection models began.' },
  { year: '2024', title: 'Model Integration', desc: 'MobileNetV2 and Gemini API integrated into the browser-based pipeline.' },
  { year: '2025', title: 'Public Launch', desc: 'AgriSmart released with support for 50+ crops and 38+ disease types.' },
  { year: '2025', title: 'Continuous Improvement', desc: 'Model accuracy improved to 98% with expanded disease database.' },
];

const About = () => (
  <div style={{ paddingTop: '80px' }}>

    {/* Hero */}
    <section className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <span style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--primary-dark)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(16,185,129,0.25)' }}>
          🌍 Our Mission
        </span>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: '800', margin: '1rem 0' }}>About AgriSmart</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.8' }}>
          AgriSmart uses advanced Artificial Intelligence to help farmers detect crop diseases early
          and take precise action — improving global food security through sustainable technology.
        </p>
      </motion.div>
    </section>

    {/* Technical Architecture */}
    <section style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)', padding: '5rem 1rem' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Technical architecture powering AgriSmart</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            {
              num: '01', color: 'var(--primary)', title: 'Image Recognition Engine',
              desc: (<>We utilize <strong>MobileNet V2</strong>, a powerful CNN pre-trained on ImageNet. It instantly recognizes plant structures and leaf types directly in your browser using TensorFlow.js.</>)
            },
            {
              num: '02', color: 'var(--secondary)', title: 'Symptom Analysis Algorithm',
              desc: (<>A <strong>HSV Color Space Analysis</strong> algorithm scans leaf tissue for discoloration (chlorosis, necrosis) indicating fungal or bacterial infections, without needing a large server dataset.</>)
            },
            {
              num: '03', color: 'var(--accent)', title: 'Gemini AI Diagnosis',
              desc: (<>The image and metadata are sent to <strong>Google Gemini 2.5 Flash</strong>, which produces a structured JSON report including disease name, confidence, severity, treatment, and preventive care steps.</>)
            },
            {
              num: '04', color: 'var(--primary)', title: 'Privacy First',
              desc: (<>Core analysis happens <strong>locally on your device</strong>. Only the plant image is shared with the Gemini API under your own key. No data is stored on our servers.</>)
            },
          ].map((step, i) => (
            <motion.div key={step.num} className="card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              style={{ borderTop: `4px solid ${step.color}`, position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: '0.5rem', right: '1rem', fontSize: '2.8rem', fontWeight: '900', color: `${step.color}18`, lineHeight: 1 }}>{step.num}</span>
              <h3 style={{ color: step.color, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="container" style={{ padding: '5rem 1rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Technology Stack</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Built with modern, production-grade tools</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {techStack.map((t, i) => (
          <motion.div key={t.name} className="card" whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {t.icon}
            </div>
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '0.3rem' }}>{t.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6' }}>{t.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Timeline */}
    <section style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)', padding: '5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Project Timeline</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Our journey from idea to impact</p>
        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }} />
          {timeline.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ position: 'relative', marginBottom: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.35rem', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid white', boxShadow: '0 0 0 3px var(--primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.year}</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0.2rem 0' }}>{item.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: '1.6' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact / CTA */}
    <section className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: '2rem', padding: '3.5rem 2rem', color: 'white' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>Contribute or Reach Out</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem' }}>AgriSmart is an open project. Feedback and contributions are always welcome.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', gap: '0.5rem', backdropFilter: 'blur(8px)' }}>
            <Github size={18} /> GitHub
          </a>
          <a href="mailto:contact@agrismart.ai" className="btn" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: '700', gap: '0.5rem' }}>
            <Mail size={18} /> Contact Us
          </a>
        </div>
      </motion.div>
    </section>
  </div>
);

export default About;
