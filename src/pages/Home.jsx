import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ShieldCheck, Sprout, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div style={{ paddingTop: '80px' }}>
            {/* Hero Section */}
            <section className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
                        Protect Your Crops with <br />
                        <span className="text-gradient">Artificial Intelligence</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Instant disease detection, expert remedies, and smart farming insights right in your pocket.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ display: 'flex', gap: '1rem' }}
                >
                    <Link to="/analyze" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        <Upload size={20} style={{ marginRight: '0.5rem' }} />
                        Upload Image
                    </Link>
                    <Link to="/about" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                        Learn More
                    </Link>
                </motion.div>

                {/* Stats / Trust */}
                <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', color: 'var(--text-muted)' }}>
                    <div className="flex-center" style={{ flexDirection: 'column' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>98%</span>
                        <span>Accuracy</span>
                    </div>
                    <div className="flex-center" style={{ flexDirection: 'column' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>50+</span>
                        <span>Crops Supported</span>
                    </div>
                    <div className="flex-center" style={{ flexDirection: 'column' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>24/7</span>
                        <span>Instant Analysis</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ padding: '5rem 1rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Why Choose AgriSmart?</h2>
                <div className="grid-cols-3">
                    <FeatureCard
                        icon={<ShieldCheck size={40} color="var(--primary)" />}
                        title="Early Detection"
                        description="Identify diseases before they spread. Our AI analyzes subtle patterns invisible to the naked eye."
                    />
                    <FeatureCard
                        icon={<Sprout size={40} color="var(--primary)" />}
                        title="Sustainable Farming"
                        description="Get precise treatment recommendations to reduce chemical usage and promote organic growth."
                    />
                    <FeatureCard
                        icon={<Smartphone size={40} color="var(--primary)" />}
                        title="Accessible Everywhere"
                        description="Works offline and online. Designed for farmers with multilingual support and easy interface."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        className="card"
        whileHover={{ y: -5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}
    >
        <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '50%' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </motion.div>
);

export default Home;
