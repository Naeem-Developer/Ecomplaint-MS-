import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import authIllustration from '../assets/auth-illustration.png';
import logo from '../assets/logo.png';

const DEPARTMENTS = {
  "Arts & Humanities": [
    "English Language & Literature", "History", "Philosophy", "Linguistics", 
    "Fine Arts / Visual Arts", "Music", "Theatre & Performing Arts", 
    "Film Studies", "Comparative Literature", "Religious Studies", 
    "Classical Studies", "Cultural Studies"
  ],
  "Natural Sciences": [
    "Physics", "Chemistry", "Biology", "Botany", "Zoology", 
    "Geology / Earth Sciences", "Environmental Science", "Astronomy & Astrophysics", 
    "Biochemistry", "Microbiology", "Genetics", "Marine Science", 
    "Atmospheric Science / Meteorology"
  ],
  "Technology & Computing": [
    "Computer Science", "Software Engineering", "Information Technology", 
    "Cybersecurity", "Artificial Intelligence & ML", "Data Science", 
    "Network Engineering", "Human-Computer Interaction"
  ],
  "Engineering": [
    "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", 
    "Chemical Engineering", "Aerospace Engineering", "Biomedical Engineering", 
    "Environmental Engineering", "Industrial Engineering", "Materials Science", 
    "Structural Engineering", "Petroleum Engineering", "Nuclear Engineering", 
    "Robotics Engineering", "Mechatronics"
  ],
  "Medical & Health Sciences": [
    "Medicine (MBBS / MD)", "Nursing", "Pharmacy", "Dentistry", 
    "Physiotherapy", "Public Health", "Nutrition & Dietetics", 
    "Optometry", "Radiology", "Occupational Therapy", 
    "Veterinary Medicine", "Psychiatry & Mental Health", "Biomedical Sciences"
  ],
  "Social Sciences": [
    "Psychology", "Sociology", "Anthropology", "Political Science", 
    "Economics", "Geography", "Archaeology", "Communication & Media Studies", 
    "Social Work", "Criminology", "International Relations", "Urban Studies"
  ],
  "Business & Management": [
    "Business Administration (BBA/MBA)", "Accounting & Finance", "Marketing", 
    "Human Resource Management", "Supply Chain & Logistics", "Entrepreneurship", 
    "International Business", "Banking & Insurance", "Operations Management"
  ],
  "Law & Governance": [
    "Law / Jurisprudence", "Constitutional Law", "International Law", 
    "Criminology & Criminal Justice", "Public Administration", "Policy Studies"
  ],
  "Languages & Linguistics": [
    "Arabic", "French", "German", "Spanish", "Chinese (Mandarin)", 
    "Urdu / Persian", "Japanese / Korean", "Translation & Interpretation"
  ],
  "Design & Architecture": [
    "Architecture", "Urban & Regional Planning", "Interior Design", 
    "Graphic Design", "Fashion Design", "Industrial Design", "Landscape Architecture"
  ],
  "Agriculture & Life Sciences": [
    "Agriculture", "Agronomy", "Horticulture", "Food Science", 
    "Animal Husbandry", "Agricultural Economics", "Fisheries & Aquaculture", "Forestry"
  ],
  "Education": [
    "Education & Teacher Training", "Special Education", "Early Childhood Education", 
    "Educational Psychology", "Curriculum & Instruction", "Physical Education"
  ],
  "Islamic & Religious Studies": [
    "Islamic Studies", "Quranic Sciences", "Hadith Studies", 
    "Islamic Jurisprudence (Fiqh)", "Comparative Religion"
  ],
  "Interdisciplinary Fields": [
    "Biotechnology", "Nanotechnology", "Energy Studies", "Cognitive Science", 
    "Neuroscience", "Space Science", "Forensic Science", "Digital Humanities", 
    "Health Informatics", "Bioinformatics"
  ]
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'student',
    category: '',
    department: '',
    batch: '',
    semester: '',
    class: '',
    roll_no: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      // Reset department if category changes
      if (name === 'category') next.department = '';
      return next;
    });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!form.department || !form.batch || !form.semester || !form.class || !form.roll_no) {
      return setError('Please fill all your academic details');
    }

    setLoading(true);
    setError('');
    try {
      // Create request payload
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        batch: form.batch,
        semester: form.semester,
        class: form.class,
        roll_no: form.roll_no
      };

      const user = await register(payload);
      toast.success(`Account created! Welcome, ${user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-split-card">
        {/* Left Illustration Side */}
        <div className="auth-split-left">
          <div style={{ marginBottom: '20px' }}>
            <h2 className="auth-title" style={{ marginBottom: '4px' }}>Create Account</h2>
            <p className="auth-subtitle">Join the complaint management system</p>
          </div>
          <img src={authIllustration} alt="Register Illustration" />
        </div>

        {/* Right Form Side */}
        <div className="auth-split-right">
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Home
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Back
            </Link>
          </div>

          <div className="auth-logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
            <div className="auth-logo-icon">
              <img src={logo} alt="Logo" />
            </div>
            <span className="auth-logo-text">E-Complaint MS</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '.9rem', color: 'var(--gray-500)' }}>Create your account</span>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon-left" />
                  <input
                    type="text"
                    name="name"
                    className="form-input input-with-icon-left"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon-left" />
                  <input
                    type="email"
                    name="email"
                    className="form-input input-with-icon-left"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Academic Details (Dynamic Two-step) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Main Category</label>
                <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {Object.keys(DEPARTMENTS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-select" value={form.department} onChange={handleChange} required disabled={!form.category}>
                  <option value="">Select Department</option>
                  {form.category && DEPARTMENTS[form.category].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Batch</label>
                <input type="text" name="batch" className="form-input" placeholder="e.g. 2021-2025" value={form.batch} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <input type="text" name="semester" className="form-input" placeholder="e.g. 4th" value={form.semester} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Class</label>
                <input type="text" name="class" className="form-input" placeholder="e.g. BSCS-A" value={form.class} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Roll No</label>
                <input type="text" name="roll_no" className="form-input" placeholder="e.g. 042" value={form.roll_no} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon-left" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className="form-input input-with-icon-left input-with-icon-right"
                    placeholder="Min 6"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="input-icon-right" onClick={() => setShowPw(s => !s)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon-left" />
                  <input
                    type="password"
                    name="confirm"
                    className="form-input input-with-icon-left"
                    placeholder="Re-enter"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 'var(--radius-full)', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'REGISTER'}
            </button>
          </form>

          <p className="auth-footer" style={{ marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
