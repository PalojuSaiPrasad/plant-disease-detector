import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard =     () => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('diseaseHistory') || '[]');
        setHistory(savedHistory);
    }, []);
    const clearHistory = () => {
        if (window.confirm('Are you sure you want to clear your history?')) { 
            
            localStorage.removeItem('diseaseHistory');
            setHistory([]);
        }
    };
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Farmer Dashboard</h1>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="btn btn-outline" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                        <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                        Clear History
                    </button>
                )}
            </div>


            {history.length === 0 ? (
                <div className="card glass" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Activity size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No Analysis History</h3>
                    <p className="text-muted">Upload crop images to start tracking disease history.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {history.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.disease}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span className="flex-center" style={{ gap: '0.25rem' }}><Calendar size={14} /> {item.date}</span>
                                        <span className="flex-center" style={{ gap: '0.25rem' }}><Clock size={14} /> {item.time}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                background: item.status === 'Healthy' ? 'var(--primary)' : 'var(--accent)',
                                                color: 'white',
                                                marginBottom: '0.25rem'
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            Confidence: <strong>{item.confidence}%</strong>
                                        </div>
                                    </div>
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
