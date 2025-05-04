import React, { useState } from 'react';
import './Support.css';

const faqs = [
  {
    question: 'Wie kann ich den Bot zu meinem Server hinzufügen?',
    answer: 'Klicke auf den Einladungslink und folge den Anweisungen.',
  },
  {
    question: 'Welche Funktionen bietet der Bot?',
    answer: 'Der Bot bietet Moderation, Economy-System, Casino und vieles mehr.',
  },
  {
    question: 'Wie erreiche ich den Support?',
    answer: 'Nutze das Kontaktformular unten, um uns zu erreichen.',
  },
];

const Support = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="support-container">
      <h1 className="support-title">Support & FAQ</h1>

      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question">{faq.question}</h2>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="contact-form">
        <h2>Kontaktformular</h2>
        {submitted ? (
          <p>Vielen Dank für deine Nachricht! Wir melden uns bald bei dir.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Dein Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Deine E-Mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Deine Nachricht"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Absenden</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Support;