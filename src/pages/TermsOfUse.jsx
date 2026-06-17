import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, AlertCircle, UserCheck, ShieldAlert } from 'lucide-react';
import Footer from '../components/Footer';
import './InfoPages.css';

const TermsOfUse = () => {
  return (
    <div className="info-page">
      <nav className="info-nav">
        <Link to="/" className="info-back-link">
          <ArrowLeft size={18} /> Back to Home
        </Link>
      </nav>

      <header className="info-hero">
        <h1>Terms of Use</h1>
        <p>The rules and guidelines for using the E-Complaint Management System.</p>
      </header>

      <main className="info-content-wrapper">
        <div className="info-card">
          <section className="info-section">
            <h2><Scale size={24} /> 1. Acceptance of Terms</h2>
            <p>By registering or using the E-Complaint platform, you agree to comply with these terms. This platform is provided for legitimate institutional feedback and grievance redressal only.</p>
          </section>

          <section className="info-section">
            <h2><UserCheck size={24} /> 2. User Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and truthful information.</p>
          </section>

          <section className="info-section">
            <h2><AlertCircle size={24} /> 3. Prohibited Conduct</h2>
            <p>Users must not engage in the following activities:</p>
            <ul>
              <li>Submitting false or malicious complaints.</li>
              <li>Harassing or threatening faculty or staff through the platform.</li>
              <li>Attempting to breach the platform's security or access unauthorized data.</li>
              <li>Using the platform for any unlawful purpose.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2><ShieldAlert size={24} /> 4. Consequences</h2>
            <p>Violation of these terms may result in account suspension, deletion, or further disciplinary action by the institution as per its internal policies.</p>
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

export default TermsOfUse;
