
import React, { useState } from 'react';
import { Tab, User } from '../types';
import { Hash, Plus, Settings, LogOut, Bell, BellOff, Shield, Users, Trash2, Edit2, Check, X, Rss } from 'lucide-react';

interface SidebarProps {
  user: User;
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onAddTab: () => void;
  onDeleteTab: (id: string) => void;
  onUpdateTab: (id: string, updates: Partial<Tab>) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, tabs, activeTabId, onTabChange, onAddTab, onDeleteTab, onUpdateTab, onLogout }) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [addingRssId, setAddingRssId] = useState<string | null>(null);
  const [rssUrl, setRssUrl] = useState('');

  const startEditing = (tab: Tab) => {
    setEditingTabId(tab.id);
    setEditName(tab.name);
  };

  const saveName = (id: string) => {
    onUpdateTab(id, { name: editName });
    setEditingTabId(null);
  };

  const addRss = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (tab && rssUrl) {
      onUpdateTab(id, { rssUrls: [...tab.rssUrls, rssUrl] });
      setRssUrl('');
      setAddingRssId(null);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 border-r border-white/20 h-screen sticky top-0 bg-white/10 backdrop-blur-2xl flex flex-col p-6 shadow-2xl z-20 overflow-hidden">
      {/* Visual background blob for glass effect */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tighter">FIN FLOW</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 relative z-10 no-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Streams</h3>
            <button onClick={onAddTab} className="text-blue-600 hover:bg-blue-100/50 p-1.5 rounded-xl transition-all active:scale-90">
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {tabs.map(tab => (
              <div key={tab.id} className="group relative">
                <div
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all cursor-pointer ${
                    activeTabId === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                    : 'text-slate-600 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Hash size={18} className={activeTabId === tab.id ? 'text-white/80' : 'text-slate-400'} />
                    {editingTabId === tab.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => saveName(tab.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveName(tab.id)}
                        className="bg-transparent border-none focus:ring-0 p-0 font-bold text-inherit w-full"
                      />
                    ) : (
                      <span className="truncate font-semibold">{tab.name}</span>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeTabId === tab.id ? 'opacity-100' : ''}`}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateTab(tab.id, { notificationsEnabled: !tab.notificationsEnabled }); }}
                      className="p-1 hover:bg-white/20 rounded-lg"
                    >
                      {tab.notificationsEnabled ? <Bell size={14} fill="currentColor" /> : <BellOff size={14} />}
                    </button>
                    {activeTabId === tab.id && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); startEditing(tab); }} className="p-1 hover:bg-white/20 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteTab(tab.id); }} className="p-1 hover:bg-rose-500/20 text-rose-500 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* RSS Dropdown UI simplified */}
                {activeTabId === tab.id && (
                   <div className="mt-2 ml-6 space-y-1">
                      {tab.rssUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-400 bg-white/40 px-2 py-1 rounded-lg truncate">
                          <Rss size={10} /> {url}
                        </div>
                      ))}
                      {addingRssId === tab.id ? (
                        <div className="flex items-center gap-1 px-2">
                          <input 
                            autoFocus
                            placeholder="RSS URL..."
                            value={rssUrl}
                            onChange={(e) => setRssUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addRss(tab.id)}
                            className="bg-white/80 text-[10px] border-none rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                          />
                          <button onClick={() => addRss(tab.id)} className="text-blue-600"><Check size={14} /></button>
                          <button onClick={() => setAddingRssId(null)} className="text-slate-400"><X size={14} /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAddingRssId(tab.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-600/70 hover:text-blue-600 px-2 py-1"
                        >
                          <Plus size={10} /> Add RSS
                        </button>
                      )}
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Ecosystem</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-slate-600 hover:bg-white/60 transition-all font-medium">
              <Users size={18} className="text-slate-400" />
              <span>Team Alpha</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-slate-600 hover:bg-white/60 transition-all font-medium">
              <Shield size={18} className="text-slate-400" />
              <span>Base DAO</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
        <div className="bg-white/60 backdrop-blur-lg p-4 rounded-3xl mb-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono bg-slate-200/50 px-1.5 py-0.5 rounded inline-block">{user.walletAddress}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-400 uppercase tracking-tighter">FIN Balance</span>
            <span className="text-blue-600">{user.finTokenBalance.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-slate-600 hover:bg-white/80 transition-all font-bold text-sm">
            <Settings size={18} />
            <span>Setup</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
