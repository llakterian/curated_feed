
import { Post, Tab } from '../types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorName: 'Naval Ravikant',
    authorHandle: 'naval',
    authorAvatar: 'https://picsum.photos/seed/naval/100/100',
    content: 'The closer you are to the truth, the more silent you become inside.',
    timestamp: '2h ago',
    likes: 12400,
    reposts: 2100,
    source: 'X',
    date: new Date(Date.now() - 1000 * 60 * 120)
  },
  {
    id: '2',
    authorName: 'Paul Graham',
    authorHandle: 'paulg',
    authorAvatar: 'https://picsum.photos/seed/paulg/100/100',
    content: 'The best way to increase your discipline is to choose something you actually want to do.',
    timestamp: '4h ago',
    likes: 8500,
    reposts: 1200,
    source: 'X',
    date: new Date(Date.now() - 1000 * 60 * 240)
  },
  {
    id: '3',
    authorName: 'Vitalik Buterin',
    authorHandle: 'VitalikButerin',
    authorAvatar: 'https://picsum.photos/seed/vitalik/100/100',
    content: 'The most important property of a public good is that it is non-excludable and non-rivalrous.',
    timestamp: '6h ago',
    likes: 15600,
    reposts: 3400,
    source: 'X',
    date: new Date(Date.now() - 1000 * 60 * 360)
  },
  {
    id: '4',
    authorName: 'TechCrunch',
    authorHandle: 'techcrunch',
    authorAvatar: 'https://picsum.photos/seed/tc/100/100',
    content: 'OpenAI announces new search capabilities, directly challenging traditional search engines.',
    timestamp: '8h ago',
    likes: 4200,
    reposts: 900,
    source: 'RSS',
    date: new Date(Date.now() - 1000 * 60 * 480)
  },
  {
    id: '5',
    authorName: 'Lex Fridman',
    authorHandle: 'lexfridman',
    authorAvatar: 'https://picsum.photos/seed/lex/100/100',
    content: 'Talking with creators about the future of human-AI collaboration. The possibilities are endless.',
    timestamp: '10h ago',
    likes: 11000,
    reposts: 1500,
    source: 'YouTube',
    date: new Date(Date.now() - 1000 * 60 * 600)
  }
];

export const INITIAL_TABS: Tab[] = [
  { id: '1', name: 'General', sources: ['naval', 'paulg'], rssUrls: [], notificationsEnabled: false },
  { id: '2', name: 'Crypto', sources: ['VitalikButerin'], rssUrls: ['https://vitalik.ca/feed.xml'], notificationsEnabled: true },
  { id: '3', name: 'Work', sources: ['techcrunch'], rssUrls: [], notificationsEnabled: true }
];
