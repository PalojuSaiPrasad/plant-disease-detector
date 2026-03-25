import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#0d1117', color: '#c9d1d9', padding: '4rem 1rem 2rem' }}>
    <div className="container" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

      {/* Brand */}
      <div>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.4rem', color: '#10b981', marginBottom: '1rem', textDecoration: 'none' }}>
          <Leaf size={24} /> AgriSmart
        </Link>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#8b949e' }}>
          AI-powered plant disease detection to protect your harvest and promote sustainable farming.
        </p>
      </div>

      {/* Pages */}
      <div>
        <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Navigation</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[['/', 'Home'], ['/analyze', 'Analyze Crop'], ['/dashboard', 'Dashboard'], ['/about', 'About']].map(([path, label]) => (
            <Link key={path} to={path} style={{ color: '#8b949e', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#10b981'}
              onMouseLeave={e => e.target.style.color = '#8b949e'}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tech */}
      <div>
        <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Technology</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {['Google Gemini AI', 'MobileNet V2 (CNN)', 'React + Vite', 'TensorFlow.js', 'Framer Motion'].map(t => (
            <span key={t} style={{ color: '#8b949e', fontSize: '0.9rem' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div>
        <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Connect</h4>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { icon: <Github size={20} />, href: 'https://github.com' },
            { icon: <Twitter size={20} />, href: 'https://twitter.com' },
            { icon: <Mail size={20} />, href: 'mailto:contact@agrismart.ai' },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#21262d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b949e', transition: 'all 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#21262d'; e.currentTarget.style.color = '#8b949e'; }}>
              {s.icon}
            </a>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#8b949e' }}>contact@agrismart.ai</p>
      </div>
    </div>

    <div style={{ borderTop: '1px solid #21262d', paddingTop: '1.5rem', textAlign: 'center', color: '#8b949e', fontSize: '0.85rem' }}>
      <span>© 2025 AgriSmart. Built with ❤️ for farmers worldwide.</span>
    </div>
  </footer>
);

export default Footer;
