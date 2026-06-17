import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import Footer from '../components/Footer';
import './InfoPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="info-page">
      <nav className="info-nav">
        <Link to="/" className="info-back-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </nav>

      <header className="info-hero">
        <h1>Privacy Policy</h1>
        <p>Your privacy is our top priority. Learn how we handle and protect your data.</p>
      </header>

      <main className="info-content-wrapper">
        <div className="info-card">
          <section className="info-section">
            <h2><Eye size={24} /> 1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, submit a complaint, or communicate with us. This includes:</p>
            <ul>
              <li>Personal identifiers (Name, Email, Phone Number)</li>
              <li>Academic/Professional details (Role, Department)</li>
              <li>Complaint details and supporting evidence (images, documents)</li>
            </ul>
          </section>

          <section className="info-section">
            <h2><Shield size={24} /> 2. How We Use Data</h2>
            <p>Your information is used solely for the purpose of managing and resolving your complaints. Specifically:</p>
            <ul>
              <li>To facilitate communication between students and faculty.</li>
              <li>To provide status updates and notifications.</li>
              <li>To generate internal reports for institutional improvement.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2><Lock size={24} /> 3. Data Protection</h2>
            <p>We employ industry-standard security measures to safeguard your information. Our platform uses end-to-end encryption for data transmission and secure hashing for sensitive credentials like passwords.</p>
          </section>

          <section className="info-section">
            <h2><FileText size={24} /> 4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time through your dashboard profile settings. If you have any concerns about your data, please contact our support team.</p>
          </section>

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-100)', color: 'var(--gray-400)', fontSize: '0.9rem', textAlign: 'center' }}>
            Last updated: May 07, 2026
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
