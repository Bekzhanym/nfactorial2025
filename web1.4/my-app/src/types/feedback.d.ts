export type Feedback = {
  id: number;
  text: string;
  likes: number;
  createdAt: string;
};

export type SortBy = 'newest' | 'popular';
