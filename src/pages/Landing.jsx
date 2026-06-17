import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ClipboardList, Search, CheckCircle, Lock, Users, FileUp, Bell, ArrowRight, Menu, X, Building, GraduationCap, Mail, Phone, MapPin, Clock, MessageCircle, BadgeCheck, ArrowRightCircle } from 'lucide-react';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import './Landing.css';

/* ––– Mini top‑nav (landing only) ––––––––––––––––––––––––––––––––––––––––––––––––––– */
const LandingNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="ln-nav">
      <div className="ln-nav-inner">
        <Link to="/" className="ln-brand">
          <span className="ln-brand-icon">
            <img src={logo} alt="Logo" />
          </span>
          <span className="ln-brand-text">E-Complaint <strong>MS</strong></span>
        </Link>

        <div className={`ln-links ${open ? 'ln-links--open' : ''}`}>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#how"      onClick={() => setOpen(false)}>How It Works</a>
          <a href="#about"    onClick={() => setOpen(false)}>About</a>
          <a href="#contact"  onClick={() => setOpen(false)}>Contact</a>
        </div>

        <div className="ln-nav-actions">
          <Link to="/login"    className="ln-btn-ghost">Sign In</Link>
          <Link to="/register" className="ln-btn-primary">Get Started</Link>
          <button className="ln-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

/* â”€â”€ Main Landing Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Landing = () => {
  const stats = [
    { value: '2,400+', label: 'Complaints Resolved' },
    { value: '5,800+', label: 'Registered Users'    },
    { value: '7',      label: 'Categories Covered'  },
    { value: '48h',    label: 'Avg. Response Time'  },
  ];

  const features = [
    {
      icon: <ClipboardList size={28} />,
      title: 'Easy Submission',
      desc:  'Fill a simple form, pick a category, and submit. Attach images or documents as supporting evidence.',
    },
    {
      icon: <Search size={28} />,
      title: 'Real-time Tracking',
      desc:  'Follow your complaint from submission to closure. Status updates appear instantly in your dashboard.',
    },
    {
      icon: <MessageCircle size={28} />,
      title: 'Admin Responses',
      desc:  'Receive official remarks and decisions from the administration directly on your complaint.',
    },
    {
      icon: <Lock size={28} />,
      title: 'Secure & Private',
      desc:  'JWT-authenticated sessions ensure your data stays private and accessible only to you and authorised staff.',
    },
    {
      icon: <FileUp size={28} />,
      title: 'Document Attachments',
      desc:  'Upload images, PDFs, or Word documents up to 5 MB to back up your complaint with solid evidence.',
    },
    {
      icon: <Users size={28} />,
      title: 'Role-based Access',
      desc:  'Separate dashboards for students, faculty, and administrators. Everyone sees exactly what they need.',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: <GraduationCap size={32} />,
      title: 'Create Your Account',
      desc:  'Register with your institutional email as a student or faculty. Approval is instant.',
    },
    {
      num: '02',
      icon: <ClipboardList size={32} />,
      title: 'Submit a Complaint',
      desc:  'Choose the category that matches your issue, describe it in detail, and attach any files.',
    },
    {
      num: '03',
      icon: <BadgeCheck size={32} />,
      title: 'Track & Get Resolution',
      desc:  'Monitor your complaint status and receive an official response from the administration.',
    },
  ];

  return (
    <div className="landing">
      <LandingNav />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-hero">
        <div className="ln-hero-bg-blob ln-hero-bg-blob--1" />
        <div className="ln-hero-bg-blob ln-hero-bg-blob--2" />
        <div className="ln-hero-inner">
          <div className="ln-hero-content">
            <span className="ln-pill">
              <ShieldCheck size={14} fill="currentColor" /> Officially Recognised Platform
            </span>
            <h1 className="ln-hero-title">
              Your Voice.<br />
              <span className="ln-gradient-text">Our Priority.</span>
            </h1>
            <p className="ln-hero-desc">
              The official complaint management portal for our institution â€” empowering
              students and faculty to raise issues and get transparent, timely resolutions
              from the administration.
            </p>
            <div className="ln-hero-ctas">
              <Link to="/register" className="ln-btn-primary ln-btn-lg">
                Submit a Complaint <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <Link to="/login" className="ln-btn-outline-light ln-btn-lg">
                Sign In
              </Link>
            </div>
            <p className="ln-hero-note">No credit card required Â· Free for all students &amp; faculty</p>
          </div>

          {/* Visual card mock */}
          <div className="ln-hero-visual">
            <div className="ln-mock-card">
              <div className="ln-mock-header">
                <div className="ln-mock-avatar">AN</div>
                <div>
                  <p className="ln-mock-name">Ahmad Nawaz</p>
                  <p className="ln-mock-role">Student</p>
                </div>
                <span className="ln-mock-badge ln-mock-badge--pending">Pending</span>
              </div>
              <div className="ln-mock-body">
                <p className="ln-mock-label">Category</p>
                <p className="ln-mock-value">Academic</p>
                <p className="ln-mock-label" style={{ marginTop: 10 }}>Title</p>
                <p className="ln-mock-value">Unfair grading in mid-term exam</p>
                <p className="ln-mock-label" style={{ marginTop: 10 }}>Submitted</p>
                <p className="ln-mock-value">03 May 2026</p>
              </div>
              <div className="ln-mock-footer">
                <div className="ln-mock-track">
                  <div className="ln-mock-track-fill" />
                </div>
                <p className="ln-mock-track-label">Under review by administration</p>
              </div>
            </div>

            <div className="ln-mock-floating ln-mock-floating--1">
              <CheckCircle size={16} fill="currentColor" color="#10b981" />
              <span>Complaint #182 Resolved</span>
            </div>
            <div className="ln-mock-floating ln-mock-floating--2">
              <Bell size={16} fill="currentColor" color="#f59e0b" />
              <span>Status updated to In Progress</span>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Stats bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-stats">
        <div className="ln-stats-inner">
          {stats.map((s, i) => (
            <div key={i} className="ln-stat-item">
              <span className="ln-stat-value">{s.value}</span>
              <span className="ln-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Features â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-features" id="features">
        <div className="ln-section-inner">
          <div className="ln-section-header">
            <span className="ln-section-tag">Platform Features</span>
            <h2 className="ln-section-title">Everything you need to get heard</h2>
            <p className="ln-section-sub">
              Built specifically for educational institutions, the platform covers the full
              lifecycle of a complaint â€” from submission to resolution.
            </p>
          </div>
          <div className="ln-features-grid">
            {features.map((f, i) => (
              <div key={i} className="ln-feature-card">
                <div className="ln-feature-icon">{f.icon}</div>
                <h3 className="ln-feature-title">{f.title}</h3>
                <p className="ln-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ How It Works â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-how" id="how">
        <div className="ln-section-inner">
          <div className="ln-section-header">
            <span className="ln-section-tag">Simple Process</span>
            <h2 className="ln-section-title">Three steps to resolution</h2>
            <p className="ln-section-sub">
              We have removed every barrier. From account creation to complaint closure,
              the entire process takes minutes â€” not days.
            </p>
          </div>
          <div className="ln-steps">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="ln-step">
                  <div className="ln-step-num">{s.num}</div>
                  <div className="ln-step-icon">{s.icon}</div>
                  <h3 className="ln-step-title">{s.title}</h3>
                  <p className="ln-step-desc">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="ln-step-arrow">
                    <ArrowRightCircle size={32} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ About â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-about" id="about">
        <div className="ln-section-inner ln-about-inner">
          <div className="ln-about-text">
            <span className="ln-section-tag">About the System</span>
            <h2 className="ln-section-title" style={{ textAlign: 'left' }}>
              Why we built this platform
            </h2>
            <p className="ln-about-desc">
              The E-Complaint Management System was created to replace slow, informal
              complaint processes â€” where issues were often lost in email threads or
              handled inconsistently. We wanted every student and faculty member to have a
              single, trustworthy place to raise concerns and receive a documented response.
            </p>
            <p className="ln-about-desc">
              Our platform is neutral, transparent, and built on the principle that
              every legitimate grievance deserves an official answer â€” not silence.
            </p>
            <div className="ln-about-points">
              <div className="ln-about-point">
                <CheckCircle size={20} fill="currentColor" color="var(--primary-600)" />
                <span>Full audit trail for every complaint</span>
              </div>
              <div className="ln-about-point">
                <CheckCircle size={20} fill="currentColor" color="var(--primary-600)" />
                <span>Category-based routing to the right department</span>
              </div>
              <div className="ln-about-point">
                <CheckCircle size={20} fill="currentColor" color="var(--primary-600)" />
                <span>Transparent status updates at every stage</span>
              </div>
              <div className="ln-about-point">
                <CheckCircle size={20} fill="currentColor" color="var(--primary-600)" />
                <span>No personal data sold or shared with third parties</span>
              </div>
            </div>
          </div>

          <div className="ln-about-cards">
            <div className="ln-about-card ln-about-card--primary">
              <Building size={36} />
              <h4>Institutional Grade</h4>
              <p>Designed for universities, colleges and schools with multiple roles and departments.</p>
            </div>
            <div className="ln-about-card ln-about-card--secondary">
              <Lock size={36} />
              <h4>Data Security</h4>
              <p>Passwords are bcrypt-hashed. All API routes are JWT-protected. Your data is safe.</p>
            </div>
            <div className="ln-about-card ln-about-card--accent">
              <Clock size={36} />
              <h4>Fast Turnaround</h4>
              <p>Admin notifications keep response times short. Average resolution under 48 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-contact" id="contact">
        <div className="ln-section-inner">
          <div className="ln-section-header">
            <span className="ln-section-tag">Contact</span>
            <h2 className="ln-section-title">Get in touch</h2>
            <p className="ln-section-sub">
              Have a question about the platform? Reach out to our support team.
            </p>
          </div>
          <div className="ln-contact-grid">
            <div className="ln-contact-item">
              <Mail size={24} />
              <div>
                <h4>Email Support</h4>
                <p>support@ecms.edu.pk</p>
              </div>
            </div>
            <div className="ln-contact-item">
              <Phone size={24} />
              <div>
                <h4>Helpline</h4>
                <p>+92 (51) 000-0000</p>
              </div>
            </div>
            <div className="ln-contact-item">
              <MapPin size={24} />
              <div>
                <h4>Office</h4>
                <p>Administration Block, Room 201</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="ln-cta">
        <div className="ln-cta-inner">
          <h2 className="ln-cta-title">Ready to raise your voice?</h2>
          <p className="ln-cta-desc">
            Join thousands of students and faculty who have used the platform to resolve
            their concerns quickly and transparently.
          </p>
          <div className="ln-hero-ctas" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="ln-btn-primary ln-btn-lg">
              Create Free Account <ArrowRight size={18} strokeWidth={3} />
            </Link>
            <Link to="/login" className="ln-btn-outline-light ln-btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
