import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Activity, LayoutDashboard, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <Leaf size={18} /> },
    { name: 'Analyze', path: '/analyze', icon: <Activity size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" className="flex-center" style={{ gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-dark)' }}>
          <Leaf size={28} />
          <span>Agri <span className="text-gradient">Smart</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: location.pathname === link.path ? '600' : '400',
                transition: 'color 0.2s'
              }}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
            Detect Disease
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="hidden-desktop" onClick={() => setIsOpen(!isOpen)} style={{ padding: '0.5rem' }}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass hidden-desktop"
            style={{
              position: 'absolute',
              top: '70px',
              left: 0,
              right: 0,
              borderTop: '1px solid var(--glass-border)',
              overflow: 'hidden'
            }}
          >
            <div className="container" style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: location.pathname === link.path ? '600' : '400',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Link
                to="/analyze"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary"
                style={{ margin: '1rem', textAlign: 'center' }}
              >
                Detect Disease
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
