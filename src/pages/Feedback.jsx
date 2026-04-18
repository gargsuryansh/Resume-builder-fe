import { useState } from 'react';
import { submitFeedback } from '../api/api.js';

export default function Feedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await submitFeedback({
        rating,
        comment,
      });
      setMessage('Thanks — feedback saved.');
      setComment('');
    } catch (err) {
      const msg =
        err.response?.data?.detail ?? err.message ?? 'Could not save feedback';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Feedback</h2>
      <p style={{ color: '#475569' }}>
        <code>POST /feedback</code> — body matches <code>Feedback</code> (rating +
        comment; optional extended fields supported server-side).
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="rating">Rating (1–5)</label>
          <input
            id="rating"
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) =>
              setRating(Number.parseInt(e.target.value, 10) || 1)
            }
          />
        </div>
        <div className="field">
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What worked well? What should improve?"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Sending…' : 'Submit'}
        </button>
      </form>
      {message ? <p style={{ color: '#047857' }}>{message}</p> : null}
      {error ? <p className="err">{error}</p> : null}
    </div>
  );
}
