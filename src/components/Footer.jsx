import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: 'Submit Complaint', to: '/register' },
      { label: 'Track Status',     to: '/login'    },
      { label: 'Admin Portal',     to: '/login'    },
    ],
    Support: [
      { label: 'Help Center',    to: '/help' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Use',   to: '/terms' },
    ],
    Roles: [
      { label: 'For Students', to: '/register' },
      { label: 'For Faculty', to: '/register' },
      { label: 'For Admin',    to: '/login'    },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">
            <span className="footer-brand-icon">
              <img src={logo} alt="Logo" />
            </span>
            <span className="footer-brand-text">
              E-Complaint <strong>MS</strong>
            </span>
          </Link>
          <p className="footer-tagline">
            The official complaint management platform for educational institutions.
            Every voice deserves to be heard.
          </p>
          <div className="footer-socials">
            <Link to="/" aria-label="Github" className="footer-social-btn"><FaGithub size={18} fill="currentColor" /></Link>
            <Link to="/" aria-label="Twitter" className="footer-social-btn"><FaTwitter size={18} fill="currentColor" /></Link>
            <Link to="/" aria-label="Linkedin" className="footer-social-btn"><FaLinkedin size={18} fill="currentColor" /></Link>
          </div>
        </div>

        {Object.entries(links).map(([group, items]) => (
          <div key={group} className="footer-link-col">
            <h4 className="footer-group-title">{group}</h4>
            <ul className="footer-link-list">
              {items.map(item => (
                <li key={item.label}>
                  {item.to.startsWith('#')
                    ? <a href={item.to}>{item.label}</a>
                    : <Link to={item.to}>{item.label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>Â© {year} E-Complaint Management System. All rights reserved.</p>
        <p className="footer-bottom-right">Built for transparency and accountability.</p>
      </div>
    </footer>
  );
};

export default Footer;
