import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, Activity, Leaf, AlertTriangle, BarChart2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('diseaseHistory') || '[]'));
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('diseaseHistory');
      setHistory([]);
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem('diseaseHistory', JSON.stringify(updated));
    setHistory(updated);
  };

  const healthy = history.filter(h => h.status === 'Healthy').length;
  const infected = history.filter(h => h.status !== 'Healthy').length;
  const critical = history.filter(h => h.status === 'Critical').length;

  const filtered = filter === 'All' ? history : history.filter(h => h.status === filter);

  const statusColor = (s) => s === 'Healthy' ? 'var(--primary)' : s === 'Critical' ? '#ef4444' : 'var(--accent)';

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Farmer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Track and manage all your crop analyses in one place.</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', gap: '0.4rem' }}>
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Stats */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Scans', value: history.length, icon: <BarChart2 size={22} />, color: 'var(--secondary)' },
            { label: 'Healthy', value: healthy, icon: <Leaf size={22} />, color: 'var(--primary)' },
            { label: 'Infected', value: infected, icon: <AlertTriangle size={22} />, color: 'var(--accent)' },
            { label: 'Critical', value: critical, icon: <Activity size={22} />, color: '#ef4444' },
          ].map(s => (
            <motion.div key={s.label} className="card" whileHover={{ y: -4 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `4px solid ${s.color}`, padding: '1.25rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '500' }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {history.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['All', 'Healthy', 'Infected', 'Critical'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', border: 'none',
                background: filter === f ? 'var(--primary)' : 'var(--glass-bg)',
                color: filter === f ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass"
          style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <Activity size={56} color="var(--text-muted)" style={{ opacity: 0.35, marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Analysis History Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Upload a crop image to start tracking disease history.</p>
          <Link to="/analyze" className="btn btn-primary">Go to Analyze</Link>
        </motion.div>
      ) : filtered.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No records match the filter "{filter}".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <AnimatePresence>
            {filtered.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, scale: 0.97 }}
                transition={{ delay: idx * 0.04 }}
                className="card"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: `5px solid ${statusColor(item.status)}` }}>

                {/* left */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <span style={{ background: statusColor(item.status), color: 'white', padding: '0.2rem 0.7rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 'bold' }}>
                      {item.status}
                    </span>
                    {item.cropName && <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>🌿 {item.cropName}</span>}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{item.disease}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={13} /> {item.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={13} /> {item.time}</span>
                    {item.severity && item.severity !== 'None' && (
                      <span>Severity: <strong>{item.severity}</strong></span>
                    )}
                  </div>
                </div>

                {/* right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: statusColor(item.status) }}>{item.confidence}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence</div>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    title="Remove this entry"
                    style={{ padding: '0.5rem', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
