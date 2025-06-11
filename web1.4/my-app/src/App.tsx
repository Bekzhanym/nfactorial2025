import { FeedbackProvider } from './store/FeedbackContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <FeedbackProvider>
      <HomePage />
    </FeedbackProvider>
  );
}

export default App;
