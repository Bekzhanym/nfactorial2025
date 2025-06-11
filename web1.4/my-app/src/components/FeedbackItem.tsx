import type { Feedback } from '../types/feedback';
import { useFeedback } from '../store/FeedbackContext';
import '../styles/FeedbackItem.css';

type Props = {
  feedback: Feedback;
  onDelete: (id: number) => void;
};

export default function FeedbackItem({ feedback, onDelete }: Props) {
  const { dispatch } = useFeedback();

  const handleLike = () => {
    dispatch({ type: 'LIKE_FEEDBACK', payload: feedback.id });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="feedback-item">
      <div className="feedback-content">
        <p className="feedback-text">{feedback.text}</p>
        <div className="feedback-meta">
          <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
        </div>
      </div>
      
      <div className="feedback-actions">
        <button 
          className={`like-button ${feedback.likes > 0 ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="like-icon">❤️</span>
          <span className="like-count">{feedback.likes}</span>
        </button>
        
        <button 
          className="delete-button"
          onClick={() => onDelete(feedback.id)}
          title="Delete feedback"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
