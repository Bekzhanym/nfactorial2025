import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import SortSelect from '../components/SortSelect';
import { useFeedback } from '../store/FeedbackContext';
import '../styles/HomePage.css';

export default function HomePage() {
  const { state, dispatch } = useFeedback();

  const addFeedback = (text: string) => {
    dispatch({ type: 'ADD_FEEDBACK', payload: text });
  };

  const deleteFeedback = (id: number) => {
    dispatch({ type: 'DELETE_FEEDBACK', payload: id });
  };

  const sortedFeedbacks = [...state.feedbacks].sort((a, b) => {
    if (state.sortBy === 'popular') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Product Feedback Board</h1>
          <p className="feedback-count">Total Ideas: {state.feedbacks.length}</p>
        </div>
      </header>

      <main className="main-content">
        <div className="sidebar">
          <div className="sort-container">
            <h2 className="section-title">Sort By</h2>
            <SortSelect />
          </div>
        </div>

        <div className="content-area">
          <section className="feedback-form-section">
            <h2 className="section-title">Add New Feedback</h2>
            <FeedbackForm onAdd={addFeedback} />
          </section>

          <section className="feedback-list-section">
            <h2 className="section-title">All Feedback</h2>
            <FeedbackList feedbacks={sortedFeedbacks} onDelete={deleteFeedback} />
          </section>
        </div>
      </main>
    </div>
  );
}
