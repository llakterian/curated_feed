
import React, { useState, useEffect, useMemo } from 'react';
import { User, Post, Tab, AppState, FeedFilter } from './types';
import { MOCK_POSTS, INITIAL_TABS } from './services/mockData';
import WalletGate from './components/WalletGate';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
// Fix: Added missing X and Heart icons to the lucide-react import list
import { Search, SlidersHorizontal, Loader2, Sparkles, Filter, Calendar, Zap, LayoutGrid, X, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TABS[0].id);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [tabSummary, setTabSummary] = useState<string | null>(null);

  const activeTab = useMemo(() => 
    tabs.find(t => t.id === activeTabId), 
    [tabs, activeTabId]
  );

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      // 1. Tab source logic (simplified mock)
      if (activeTab?.name === 'Crypto') {
        if (post.authorHandle !== 'VitalikButerin' && post.source !== 'RSS') return false;
      }
      if (activeTab?.name === 'Work') {
        if (post.authorHandle !== 'techcrunch') return false;
      }

      // 2. Feed Source Filter (Global for the view)
      if (feedFilter === 'X' && post.source !== 'X') return false;
      if (feedFilter === 'RSS' && post.source !== 'RSS') return false;
      if (feedFilter === 'YouTube' && post.source !== 'YouTube') return false;

      // 3. Search Query Logic (supports from:handle operator)
      const q = searchQuery.toLowerCase();
      if (!q) return true;

      if (q.startsWith('from:')) {
        const handle = q.replace('from:', '').trim();
        return post.authorHandle.toLowerCase().includes(handle);
      }
      if (q.startsWith('source:')) {
        const src = q.replace('source:', '').trim();
        return post.source.toLowerCase().includes(src);
      }

      return post.content.toLowerCase().includes(q) ||
             post.authorName.toLowerCase().includes(q) ||
             post.authorHandle.toLowerCase().includes(q);
    });

    // 4. Sorting logic
    if (feedFilter === 'recent') {
      result = [...result].sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (feedFilter === 'popular') {
      result = [...result].sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, activeTab, searchQuery, feedFilter]);

  const handleConnect = (newUser: User) => {
    setUser(newUser);
    setAppState(AppState.DASHBOARD);
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleBookmark = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
  };

  // Tab CRUD
  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTab: Tab = { id: newId, name: 'New Stream', sources: [], rssUrls: [], notificationsEnabled: false };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const deleteTab = (id: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) setActiveTabId(newTabs[0].id);
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs(tabs.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const generateSummary = async () => {
    if (!filteredPosts.length) return;
    setIsSummarizing(true);
    setTabSummary(null);

    try {
      // Fix: Strictly using process.env.API_KEY without fallback for initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Review the following social media stream for the "${activeTab?.name}" group. Give me a 3-sentence summary of the main narratives and sentiment. \n${filteredPosts.slice(0, 10).map(p => p.content).join('\n')}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a Gen Z analyst tracking high-signal data. Be brief, use modern terminology, and highlight key trends."
        }
      });

      setTabSummary(response.text || "Summary unavailable.");
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setTabSummary("Failed to generate AI summary. Please check your connection.");
    } finally {
      setIsSummarizing(false);
    }
  };

  if (appState === AppState.LANDING) {
    return <WalletGate onConnect={handleConnect} />;
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-inter selection:bg-blue-600/10 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {user && (
        <Sidebar 
          user={user}
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          onAddTab={addTab}
          onDeleteTab={deleteTab}
          onUpdateTab={updateTab}
          onLogout={() => setAppState(AppState.LANDING)}
        />
      )}

      <main className="flex-1 max-w-5xl mx-auto min-h-screen pb-20 px-8">
        <div className="sticky top-0 z-20 pt-8 pb-4 bg-[#F8FAFC]/80 backdrop-blur-md">
          <div className="">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  {activeTab?.name || 'Feed'}
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{filteredPosts.length} items</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium">Curated signals filtered by your preferences</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search content or 'from:user'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full md:w-80 shadow-sm transition-all outline-none"
                  />
                </div>
                <div className="relative group">
                  <button className="p-4 bg-white border border-slate-200 rounded-[24px] text-slate-500 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all active:scale-95">
                    <SlidersHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Summary Banner (Glass Card) */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-[32px] p-1 shadow-xl shadow-blue-500/20 mb-8 transition-all hover:scale-[1.01]">
              <div className="bg-white/95 backdrop-blur-xl rounded-[30px] p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Intelligence Briefing</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini Pro on Base</p>
                    </div>
                  </div>
                  {!tabSummary && !isSummarizing && (
                    <button 
                      onClick={generateSummary}
                      className="group/btn flex items-center gap-2 bg-slate-900 text-white text-xs font-black px-5 py-2.5 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                      <Zap size={14} className="fill-current" />
                      SYNTHESIZE ALPHA
                    </button>
                  )}
                </div>
                
                {isSummarizing && (
                  <div className="mt-4 flex items-center gap-3 text-blue-600 font-black text-sm animate-pulse px-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>EXTRACTING SIGNAL FROM NOISE...</span>
                  </div>
                )}

                {tabSummary && (
                  <div className="mt-4 p-5 bg-blue-50/50 border border-blue-100/50 rounded-2xl relative overflow-hidden group/summary">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/summary:opacity-100 transition-opacity">
                      <button onClick={() => setTabSummary(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium italic">
                      "{tabSummary}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => setFeedFilter('all')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${feedFilter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <LayoutGrid size={14} /> ALL FEEDS
              </button>
              <button 
                onClick={() => setFeedFilter('X')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${feedFilter === 'X' ? 'bg-black text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                X (TWITTER)
              </button>
              <button 
                onClick={() => setFeedFilter('RSS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${feedFilter === 'RSS' ? 'bg-orange-500 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                RSS FEEDS
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2" />
              <button 
                onClick={() => setFeedFilter('recent')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${feedFilter === 'recent' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <Calendar size={14} /> NEWEST
              </button>
              <button 
                onClick={() => setFeedFilter('popular')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${feedFilter === 'popular' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <Heart size={14} className="fill-current" /> VIRAL
              </button>
            </div>
          </div>
        </div>

        {/* Feed Content */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <Search size={64} className="text-slate-200" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Signal Lost</h3>
              <p className="text-slate-400 font-medium max-w-xs">
                No content matches your current filters. Try expanding your search or adding more sources to this stream.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Glass Sidebar Right */}
      <aside className="hidden xl:block w-96 p-8 h-screen sticky top-0 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative bg-white/60 backdrop-blur-2xl rounded-[40px] p-8 border border-white/80 shadow-2xl">
              <h3 className="text-xl font-black mb-4 text-slate-900">FIN Ecosystem</h3>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                Unlock deeper insights by staking FIN on Base. Holders get real-time YouTube alerts and unlimited AI synthesis.
              </p>
              <div className="bg-slate-900 text-white rounded-3xl p-5 flex items-center justify-between mb-6 shadow-xl shadow-slate-900/20">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staked Value</p>
                  <p className="text-lg font-black">2.4k FIN</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield</p>
                  <p className="text-lg font-black text-green-400">+12%</p>
                </div>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] text-sm font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                MANAGE STAKE
              </button>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-white/60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Trending Now</h3>
              <Filter size={14} className="text-slate-400" />
            </div>
            <div className="space-y-6">
              {[
                { tag: '#BaseL2', count: '45.2k', up: true },
                { tag: '#FIN', count: '12.8k', up: true },
                { tag: '#GeminiAI', count: '8.4k', up: false },
                { tag: '#Onchain', count: '31.1k', up: true },
              ].map(item => (
                <div key={item.tag} className="flex items-center justify-between group cursor-pointer">
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.tag}</span>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{item.count}</p>
                    <p className={`text-[10px] font-black ${item.up ? 'text-green-500' : 'text-slate-400'}`}>{item.up ? '↑ TRENDING' : '• STABLE'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              V 2.0.4 • POWERED BY BASE
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default App;
