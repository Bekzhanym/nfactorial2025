import React, { useState } from 'react';
import '../styles/FeedbackForm.css';

type Props = {
  onAdd: (text: string) => void;
};

export default function FeedbackForm({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter your feedback');
      return;
    }
    onAdd(text);
    setText('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <div className="form-group">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Share your feedback or suggestion..."
          className={`feedback-input ${error ? 'error' : ''}`}
          rows={3}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <button type="submit" className="submit-button">
        Submit Feedback
      </button>
    </form>
  );
}
