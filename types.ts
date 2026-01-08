
export interface User {
  id: string;
  name: string;
  walletAddress: string;
  finTokenBalance: number;
}

export interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  source: 'X' | 'RSS' | 'YouTube';
  isLiked?: boolean;
  isBookmarked?: boolean;
  date: Date;
}

export interface Tab {
  id: string;
  name: string;
  sources: string[]; // List of handles
  rssUrls: string[]; // List of custom RSS feed URLs
  notificationsEnabled: boolean;
}

export enum AppState {
  LANDING = 'LANDING',
  AUTHENTICATING = 'AUTHENTICATING',
  DASHBOARD = 'DASHBOARD'
}

export type FeedFilter = 'all' | 'X' | 'RSS' | 'YouTube' | 'recent' | 'popular';
