import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ShieldCheck, Sprout, Smartphone, ArrowRight, Zap, BarChart2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

/* ---------- animated counter ---------- */
const useCounter = (target, duration = 1800) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
};

const StatCounter = ({ value, suffix, label }) => {
  const { ref, count } = useCounter(value);
  return (
    <div ref={ref} className="flex-center" style={{ flexDirection: 'column', gap: '0.25rem' }}>
      <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>
        {count}{suffix}
      </span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{label}</span>
    </div>
  );
};

/* ---------- steps section ---------- */
const steps = [
  { num: '01', icon: <Upload size={28} color="var(--primary)" />, title: 'Upload a Photo', desc: 'Take or upload any clear photo of your crop leaf.' },
  { num: '02', icon: <Zap size={28} color="var(--primary)" />, title: 'AI Scans Instantly', desc: 'Gemini AI analyses patterns, colors, and textures in seconds.' },
  { num: '03', icon: <BarChart2 size={28} color="var(--primary)" />, title: 'Get Full Report', desc: 'Receive disease name, severity, symptoms, and treatment plan.' },
];

/* ---------- testimonials ---------- */
const testimonials = [
  { name: 'Ravi Kumar', role: 'Wheat Farmer, Punjab', text: 'AgriSmart detected blight in my wheat field two weeks before I could see it. Saved my entire crop this season!' },
  { name: 'Anita Sharma', role: 'Horticulturist, Maharashtra', text: 'The treatment recommendations are spot on. I reduced pesticide usage by 40% using the organic suggestions.' },
  { name: 'Dr. M. Patel', role: 'Agricultural Scientist', text: 'Impressive accuracy for a browser-based tool. A game-changer for small-scale farmers in rural areas.' },
];

const Home = () => (
  <div style={{ paddingTop: '80px' }}>

    {/* ── Hero ── */}
    <section className="container" style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>


      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 style={{ fontSize: 'clamp(2.2rem,6vw,3.8rem)', fontWeight: '800', lineHeight: '1.15', marginBottom: '1rem' }}>
          Protect Your Crops with <br />
          <span className="text-gradient">Artificial Intelligence</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
          Instant disease detection, expert remedies, and smart farming insights — right in your browser.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.5 }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/analyze" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2rem', gap: '0.5rem' }}>
          <Upload size={20} /> Analyze Crop Now
        </Link>
        <Link to="/about" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
          Learn How It Works <ArrowRight size={18} style={{ marginLeft: '0.3rem' }} />
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
        style={{ display: 'flex', gap: '3.5rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1.5rem 2.5rem', borderRadius: '1.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)' }}>
        <StatCounter value={98} suffix="%" label="AI Accuracy" />
        <StatCounter value={50} suffix="+" label="Crops Supported" />
        <StatCounter value={38} suffix="+" label="Diseases Detected" />
        <StatCounter value={5} suffix="s" label="Avg. Analysis Time" />
      </motion.div>
    </section>

    {/* ── How It Works ── */}
    <section style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)', padding: '5rem 1rem' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Three simple steps to protect your harvest</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {steps.map((s, i) => (
            <motion.div key={s.num} className="card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              style={{ position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: '1rem', right: '1.2rem', fontSize: '3rem', fontWeight: '900', color: 'rgba(16,185,129,0.08)', lineHeight: 1 }}>{s.num}</span>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ── */}
    <section className="container" style={{ padding: '5rem 1rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Why Choose AgriSmart?</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Built for farmers. Backed by science.</p>
      <div className="grid-cols-3">
        <FeatureCard icon={<ShieldCheck size={40} color="var(--primary)" />} title="Early Detection" description="Identify diseases before they spread. Our AI analyses subtle patterns invisible to the naked eye." />
        <FeatureCard icon={<Sprout size={40} color="var(--primary)" />} title="Sustainable Farming" description="Get precise treatment recommendations that reduce chemical usage and promote organic growth." />
        <FeatureCard icon={<Smartphone size={40} color="var(--primary)" />} title="Accessible Everywhere" description="Works in the browser — no app install needed. Designed for every farmer, everywhere." />
        <FeatureCard icon={<Zap size={40} color="var(--secondary)" />} title="Instant Results" description="Results in under 5 seconds, powered by Gemini's blazing multimodal capability." />
        <FeatureCard icon={<BarChart2 size={40} color="var(--secondary)" />} title="Track History" description="Your dashboard stores every past scan so you can monitor crop health over time." />
        <FeatureCard icon={<Globe size={40} color="var(--secondary)" />} title="50+ Crop Types" description="From tomatoes to sugarcane — AgriSmart supports a wide range of food and cash crops." />
      </div>
    </section>

    {/* ── Testimonials ── */}
    <section style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)', padding: '5rem 1rem' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>Trusted by Farmers</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Real stories from the field</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              style={{ borderTop: '4px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: '1.7' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA Banner ── */}
    <section className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: '2rem', padding: '4rem 2rem', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to protect your crops?</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.05rem' }}>Upload any leaf image and get an AI diagnosis in seconds — completely free.</p>
        <Link to="/analyze" className="btn" style={{ background: 'white', color: 'var(--primary-dark)', fontSize: '1.05rem', padding: '1rem 2.5rem', fontWeight: '700' }}>
          <Upload size={20} style={{ marginRight: '0.5rem' }} /> Start Analyzing
        </Link>
      </motion.div>
    </section>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div className="card" whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
    <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '50%' }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

export default Home;
