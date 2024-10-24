export interface SubredditData {
  subreddit: string;
  subscribers: number;
  moderator: string;
}

export type SortField = keyof SubredditData;
export type SortDirection = 'asc' | 'desc';