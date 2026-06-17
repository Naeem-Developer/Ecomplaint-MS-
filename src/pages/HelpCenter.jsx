import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, PhoneCall, Mail, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';
import './InfoPages.css';

const HelpCenter = () => {
  return (
    <div className="info-page">
      <nav className="info-nav">
        <Link to="/" className="info-back-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </nav>

      <header className="info-hero">
        <h1>Help Center</h1>
        <p>Everything you need to know about using our complaint management platform.</p>
      </header>

      <main className="info-content-wrapper">
        <div className="info-card">
          <section className="info-section">
            <h2><BookOpen size={24} /> Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--gray-900)', fontWeight: 700, marginBottom: '0.5rem' }}>How do I track my complaint?</h4>
                <p style={{ margin: 0 }}>Simply log in to your dashboard and visit the "My Complaints" section to see real-time updates.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--gray-900)', fontWeight: 700, marginBottom: '0.5rem' }}>What files can I attach?</h4>
                <p style={{ margin: 0 }}>You can attach JPG, PNG, and PDF files up to 5MB to support your complaint.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--gray-900)', fontWeight: 700, marginBottom: '0.5rem' }}>Is my identity anonymous?</h4>
                <p style={{ margin: 0 }}>Complaints are shared with the relevant faculty and admins to facilitate resolution, but are kept confidential within the institution.</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2><HelpCircle size={24} /> Need more help?</h2>
            <p>Our support team is available to assist you with any technical or procedural issues.</p>
            
            <div className="help-grid">
              <div className="help-item">
                <div className="help-icon"><MessageSquare size={32} /></div>
                <h3>Live Support</h3>
                <p>Chat with us live between 9:00 AM and 5:00 PM.</p>
              </div>
              <div className="help-item">
                <div className="help-icon"><Mail size={32} /></div>
                <h3>Email Us</h3>
                <p>Send your queries to support@e-complaint.edu</p>
              </div>
              <div className="help-item">
                <div className="help-icon"><PhoneCall size={32} /></div>
                <h3>Call Center</h3>
                <p>Toll-free helpdesk: 1800-COMPLAINT</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
