import React from 'react';
import { useFeedback } from '../store/FeedbackContext';
import type { SortBy } from '../types/feedback';
import '../styles/SortSelect.css';

export default function SortSelect() {
  const { state, dispatch } = useFeedback();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_SORT', payload: e.target.value as SortBy });
  };

  return (
    <div className="sort-select-container">
      <label className="sort-label" htmlFor="sort-select">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={state.sortBy}
        onChange={handleChange}
      >
        <option value="newest">Latest</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  );
}
