import type { Feedback, SortBy } from '../types/feedback';

export type State = {
  feedbacks: Feedback[];
  sortBy: SortBy;
};

export type Action =
  | { type: 'ADD_FEEDBACK'; payload: string }
  | { type: 'DELETE_FEEDBACK'; payload: number }
  | { type: 'LIKE_FEEDBACK'; payload: number }
  | { type: 'SET_SORT'; payload: SortBy };

export const initialState: State = {
  feedbacks: [],
  sortBy: 'newest',
};

export function feedbackReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_FEEDBACK':
      const newFeedback: Feedback = {
        id: Date.now(),
        text: action.payload,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      return { ...state, feedbacks: [newFeedback, ...state.feedbacks] };

    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.filter((f) => f.id !== action.payload),
      };

    case 'LIKE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map((f) =>
          f.id === action.payload ? { ...f, likes: f.likes + 1 } : f
        ),
      };

    case 'SET_SORT':
      return { ...state, sortBy: action.payload };

    default:
      return state;
  }
}
