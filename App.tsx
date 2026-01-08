
import React, { useState, useEffect, useMemo } from 'react';
import { User, Post, Tab, AppState, FeedFilter } from './types';
import { MOCK_POSTS, INITIAL_TABS } from './services/mockData';
import WalletGate from './components/WalletGate';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import SettingsModal from './components/SettingsModal';
import { Search, SlidersHorizontal, Loader2, Sparkles, Filter, Calendar, Zap, LayoutGrid, X, Heart, Plus, Hash, Menu } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TABS[0].id);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [tabSummary, setTabSummary] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('curated_feed_user');
    const savedTabs = localStorage.getItem('curated_feed_tabs');
    const savedPosts = localStorage.getItem('curated_feed_posts');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTabs) setTabs(JSON.parse(savedTabs));
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((p: any) => ({
        ...p,
        date: new Date(p.date)
      }));
      setPosts(parsedPosts);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (user) localStorage.setItem('curated_feed_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('curated_feed_tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('curated_feed_posts', JSON.stringify(posts));
  }, [posts]);

  const activeTab = useMemo(() => 
    tabs.find(t => t.id === activeTabId), 
    [tabs, activeTabId]
  );

  useEffect(() => {
    if (activeTab && activeTab.defaultFilter) {
      setFeedFilter(activeTab.defaultFilter);
    }
    setTagFilter(null);
    setIsSidebarOpen(false); // Close sidebar on mobile when tab changes
  }, [activeTabId]);

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      if (activeTab && activeTab.sources.length > 0) {
        const matchesHandle = activeTab.sources.includes(post.authorHandle);
        const matchesRss = post.source === 'RSS' && (activeTab.rssUrls.length > 0);
        if (!matchesHandle && !matchesRss) return false;
      }
      if (feedFilter === 'X' && post.source !== 'X') return false;
      if (feedFilter === 'RSS' && post.source !== 'RSS') return false;
      if (feedFilter === 'YouTube' && post.source !== 'YouTube') return false;
      if (tagFilter && !post.tags.includes(tagFilter)) return false;

      const q = searchQuery.toLowerCase();
      if (!q) return true;

      if (q.startsWith('from:')) return post.authorHandle.toLowerCase().includes(q.replace('from:', '').trim());
      if (q.startsWith('source:')) return post.source.toLowerCase().includes(q.replace('source:', '').trim());
      if (q.startsWith('#')) return post.tags.some(t => t.includes(q.replace('#', '').trim()));

      return post.content.toLowerCase().includes(q) ||
             post.authorName.toLowerCase().includes(q) ||
             post.authorHandle.toLowerCase().includes(q);
    });

    if (feedFilter === 'recent') result = [...result].sort((a, b) => b.date.getTime() - a.date.getTime());
    else if (feedFilter === 'popular') result = [...result].sort((a, b) => b.likes - a.likes);

    return result;
  }, [posts, activeTab, searchQuery, feedFilter, tagFilter]);

  const handleConnect = (newUser: User) => {
    const savedUserStr = localStorage.getItem('curated_feed_user');
    if (savedUserStr) {
      const saved = JSON.parse(savedUserStr);
      setUser({ ...newUser, name: saved.name || newUser.name, avatar: saved.avatar || newUser.avatar });
    } else {
      setUser(newUser);
    }
    setAppState(AppState.DASHBOARD);
  };

  const addTab = (name = 'New Stream') => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTab: Tab = { id: newId, name, sources: [], rssUrls: [], notificationsEnabled: false, defaultFilter: 'recent' };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const generateSummary = async () => {
    if (!filteredPosts.length) return;
    setIsSummarizing(true);
    setTabSummary(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Review the following stream for "${activeTab?.name}". Give me a 3-sentence summary: \n${filteredPosts.slice(0, 10).map(p => p.content).join('\n')}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: "Be brief, Gen Z analyst style." }
      });
      setTabSummary(response.text || "Summary unavailable.");
    } catch (error) {
      setTabSummary("AI Synthesis Offline.");
    } finally {
      setIsSummarizing(false);
    }
  };

  if (appState === AppState.LANDING) return <WalletGate onConnect={handleConnect} />;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-inter selection:bg-blue-600/10 relative overflow-x-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-full lg:w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Responsive Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {user && (
          <Sidebar 
            user={user}
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            onAddTab={() => addTab()}
            onDeleteTab={(id) => setTabs(tabs.filter(t => t.id !== id))}
            onUpdateTab={(id, upd) => setTabs(tabs.map(t => t.id === id ? { ...t, ...upd } : t))}
            onReorderTabs={setTabs}
            onLogout={() => setAppState(AppState.LANDING)}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </div>

      {showSettings && user && (
        <SettingsModal 
          user={user}
          onClose={() => setShowSettings(false)}
          onUpdate={(updates) => setUser({ ...user, ...updates })}
        />
      )}

      <main className="flex-1 w-full max-w-5xl mx-auto min-h-screen pb-20 px-4 md:px-8">
        <header className="sticky top-0 z-20 pt-4 md:pt-8 pb-4 bg-[#F8FAFC]/80 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-all"
                >
                  <Menu size={24} />
                </button>
                <div className="space-y-0.5">
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                    {activeTab?.name || 'Feed'}
                  </h1>
                  <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{filteredPosts.length} signals active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="hidden sm:relative sm:group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search feed..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-[20px] text-sm focus:ring-4 focus:ring-blue-500/10 w-48 lg:w-64 transition-all outline-none"
                  />
                </div>
                <button 
                  onClick={() => addTab('New Alpha')}
                  className="flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-[20px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 transition-all group/quick ring-offset-2 ring-blue-500/20 hover:ring-2"
                >
                  <Plus size={18} className="group-hover/quick:rotate-90 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Quick Add</span>
                </button>
              </div>
            </div>

            {/* Mobile Search - Only visible on small screens */}
            <div className="sm:hidden relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search feeds, #tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm focus:ring-4 focus:ring-blue-500/10 outline-none"
              />
            </div>
          </div>
        </header>

        {/* AI Briefing - Glass Design */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-[1px] shadow-xl shadow-blue-500/10 mb-8 transition-all hover:scale-[1.005]">
          <div className="bg-white/95 backdrop-blur-xl rounded-[31px] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Signal Briefing</h3>
              </div>
              {!tabSummary && !isSummarizing && (
                <button onClick={generateSummary} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 active:scale-95 transition-all">SYNTHESIZE</button>
              )}
            </div>
            
            {isSummarizing ? (
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs animate-pulse"><Loader2 className="animate-spin" size={14} /> FILTERING NOISE...</div>
            ) : tabSummary ? (
              <div className="text-sm text-slate-600 italic leading-relaxed border-l-2 border-blue-500/20 pl-4">{tabSummary}</div>
            ) : (
              <p className="text-xs text-slate-400">Ready to extract market signal from current tab.</p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2 mask-fade-right">
          <button onClick={() => setFeedFilter('all')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${feedFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>ALL</button>
          <button onClick={() => setFeedFilter('recent')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${feedFilter === 'recent' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}><Calendar size={12}/> RECENT</button>
          <button onClick={() => setFeedFilter('popular')} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${feedFilter === 'popular' ? 'bg-rose-500 text-white' : 'bg-white text-slate-500'}`}><Zap size={12}/> POPULAR</button>
          {tagFilter && <button onClick={() => setTagFilter(null)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black bg-blue-100 text-blue-600 border border-blue-200">#{tagFilter.toUpperCase()} <X size={12} /></button>}
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={(id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes-1 : p.likes+1 } : p))}
              onBookmark={(id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p))}
              onAddTag={(pid, tag) => setPosts(prev => prev.map(p => p.id === pid ? { ...p, tags: Array.from(new Set([...p.tags, tag])) } : p))}
              onFilterByTag={setTagFilter}
            />
          ))}
        </div>
      </main>

      {/* Responsive Ecosystem Sidebar (Right) */}
      <aside className="hidden xl:block w-80 p-8 h-screen sticky top-0">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl space-y-6">
          <h3 className="text-xl font-black">FIN Staking</h3>
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rewards</p>
            <p className="text-xl font-black text-blue-400">+14.2% APY</p>
          </div>
          <button className="w-full py-4 bg-blue-600 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">STAKE NOW</button>
        </div>
      </aside>
    </div>
  );
};

export default App;
