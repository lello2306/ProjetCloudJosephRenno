import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  const PET_API = 'http://localhost:8081';
  const ADOPT_API = 'http://localhost:3000';

  useEffect(() => {
    fetchPets();
    fetchAdoptions();
  }, []);

  async function fetchPets() {
    try {
      const res = await fetch(`${PET_API}/api/pets`);
      setPets(await res.json());
    } catch (e) {
      console.error('Failed to fetch pets:', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdoptions() {
    try {
      const res = await fetch(`${ADOPT_API}/api/adoptions`);
      setAdoptions(await res.json());
    } catch (e) {
      console.error('Failed to fetch adoptions:', e);
    }
  }

  async function handleAdopt(petId, petName) {
    if (!form.name || !form.email) {
      setMessage('Please fill in your name and email first');
      setMessageType('error');
      return;
    }
    try {
      const res = await fetch(`${ADOPT_API}/api/adoptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId,
          adopterName: form.name,
          adopterEmail: form.email,
        }),
      });
      if (res.ok) {
        setMessage(`You adopted ${petName}! Welcome to the family 🎉`);
        setMessageType('success');
        fetchPets();
        fetchAdoptions();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Adoption failed');
        setMessageType('error');
      }
    } catch (e) {
      setMessage('Could not connect to the server');
      setMessageType('error');
    }
  }

  const speciesEmoji = {
    dog: '🐕',
    cat: '🐈',
    rabbit: '🐇',
    bird: '🐦',
    fish: '🐟',
  };

  const availablePets = pets.filter(p => p.available);
  const adoptedPets = pets.filter(p => !p.available);

  return (
    <div className="app">
      {}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      <div className="bg-shape bg-shape-3"></div>

      {}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🐾</span>
          <div>
            <h1>Pet Adoption</h1>
            <p className="tagline">Find your new best friend</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{availablePets.length}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat">
            <span className="stat-number">{adoptions.length}</span>
            <span className="stat-label">Adopted</span>
          </div>
        </div>
      </header>

      {}
      <section className="form-section">
        <h2 className="section-title">
          <span className="section-icon">✍️</span>
          Your Details
        </h2>
        <div className="form-row">
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Marie Dupont"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. marie@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      {}
      {message && (
        <div className={`toast toast-${messageType}`} onClick={() => setMessage('')}>
          {message}
        </div>
      )}

      {}
      <section className="pets-section">
        <h2 className="section-title">
          <span className="section-icon">💛</span>
          Pets Looking for a Home
        </h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading pets...</p>
          </div>
        ) : availablePets.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎉</span>
            <p>All pets have been adopted! Check back later.</p>
          </div>
        ) : (
          <div className="pets-grid">
            {availablePets.map((pet, index) => (
              <div className="pet-card" key={pet.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="pet-emoji">
                  {speciesEmoji[pet.species?.toLowerCase()] || '🐾'}
                </div>
                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <div className="pet-details">
                    <span className="pet-tag">{pet.species}</span>
                    <span className="pet-tag">{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                  </div>
                </div>
                <button className="adopt-btn" onClick={() => handleAdopt(pet.id, pet.name)}>
                  Adopt {pet.name}
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {}
      {adoptions.length > 0 && (
        <section className="adoptions-section">
          <h2 className="section-title">
            <span className="section-icon">🏠</span>
            Happy Families
          </h2>
          <div className="adoptions-list">
            {adoptions.map((a, index) => (
              <div className="adoption-card" key={a.id} style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="adoption-icon">❤️</div>
                <div className="adoption-info">
                  <strong>{a.adopter_name || a.adopterName}</strong>
                  <span> adopted </span>
                  <strong>{a.pet_name || a.petName}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {}
      <footer className="footer">
        <p>Pet Adoption Platform — Microservices Project 2026</p>
        <p className="footer-tech">Spring Boot · Node.js · React · PostgreSQL · Kubernetes</p>
      </footer>
    </div>
  );
}

export default App;