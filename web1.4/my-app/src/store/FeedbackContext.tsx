import {
  createContext,
  useReducer,
  useContext,
} from 'react';
import type { ReactNode, Dispatch } from 'react';
import {
  feedbackReducer,
  initialState,
} from './feedbackReducer';
import type { State, Action } from './feedbackReducer';

const FeedbackContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  return (
    <FeedbackContext.Provider value={{ state, dispatch }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);
