import FeedbackItem from './FeedbackItem';
import type { Feedback } from '../types/feedback';
import '../styles/FeedbackList.css';

type Props = {
  feedbacks: Feedback[];
  onDelete: (id: number) => void;
};

export default function FeedbackList({ feedbacks, onDelete }: Props) {
  if (feedbacks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-message">No feedback yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      {feedbacks.map((fb) => (
        <FeedbackItem key={fb.id} feedback={fb} onDelete={onDelete} />
      ))}
    </div>
  );
}
