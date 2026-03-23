import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About AgriSmart</h1>

            <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    AgriSmart uses advanced Artificial Intelligence to help farmers detect crop diseases early.
                    Our mission is to improve global food security through sustainable technology.
                </p>

                <div className="card glass" style={{ textAlign: 'left', padding: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                        How It Works (Technical Architecture)
                    </h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            1. Image Recognition Engine
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            We utilize <strong>MobileNet V2</strong>, a powerful Convolutional Neural Network (CNN) pre-trained on the ImageNet dataset.
                            This model allows the app to instantly recognize plant structures, leaves, and crop types directly in your browser using TensorFlow.js.
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            2. Symptom Analysis Algorithm
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            To diagnose diseases without requiring a massive server-side dataset, we implement a
                            <strong> HSV Color Space Analysis</strong> algorithm. This scans the leaf's tissue for specific
                            discoloration patterns (chlorosis, necrosis) that indicate fungal or bacterial infections.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            3. Privacy First
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            All analysis happens <strong>locally on your device</strong>. Your photos are never sent to a cloud server, ensuring
                            your data remains private and the app works even with poor internet connectivity.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
