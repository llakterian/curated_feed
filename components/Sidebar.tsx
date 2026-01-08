
import React, { useState } from 'react';
import { Tab, User, FeedFilter } from '../types';
import { Hash, Plus, Settings, LogOut, Bell, BellOff, Shield, Users, Trash2, Edit2, Check, X, Rss, GripVertical, UserPlus, Filter, User as UserIcon } from 'lucide-react';

interface SidebarProps {
  user: User;
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onAddTab: () => void;
  onDeleteTab: (id: string) => void;
  onUpdateTab: (id: string, updates: Partial<Tab>) => void;
  onReorderTabs: (tabs: Tab[]) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, tabs, activeTabId, onTabChange, onAddTab, onDeleteTab, onUpdateTab, onReorderTabs, onLogout, onOpenSettings }) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [addingSourceId, setAddingSourceId] = useState<string | null>(null);
  const [sourceHandle, setSourceHandle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const startEditing = (tab: Tab) => {
    setEditingTabId(tab.id);
    setEditName(tab.name);
  };

  const addSource = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (tab && sourceHandle) {
      const cleanHandle = sourceHandle.replace('@', '');
      onUpdateTab(id, { sources: [...tab.sources, cleanHandle] });
      setSourceHandle('');
      setAddingSourceId(null);
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newTabs = [...tabs];
    const draggedItem = newTabs[draggedIndex];
    newTabs.splice(draggedIndex, 1);
    newTabs.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    onReorderTabs(newTabs);
  };

  return (
    <div className="w-80 max-w-[90vw] flex-shrink-0 border-r border-white/20 h-screen bg-white/10 backdrop-blur-2xl flex flex-col p-6 shadow-2xl relative">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter">FIN FLOW</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 relative z-10 no-scrollbar">
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streams</h3>
            <button onClick={onAddTab} className="text-blue-600 hover:bg-blue-100/50 p-1.5 rounded-xl transition-all"><Plus size={18} /></button>
          </div>
          <div className="space-y-2">
            {tabs.map((tab, idx) => (
              <div key={tab.id} draggable onDragStart={e => onDragStart(e, idx)} onDragOver={e => onDragOver(e, idx)} onDragEnd={()=>setDraggedIndex(null)}>
                <div onClick={() => onTabChange(tab.id)} className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all cursor-pointer ${activeTabId === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-600 hover:bg-white/60'}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <GripVertical size={14} className="text-slate-300" />
                    {editingTabId === tab.id ? (
                      <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onBlur={()=> {onUpdateTab(tab.id, {name: editName}); setEditingTabId(null);}} className="bg-transparent border-none p-0 font-bold w-full" />
                    ) : (
                      <span className="truncate font-semibold">{tab.name}</span>
                    )}
                  </div>
                  {activeTabId === tab.id && (
                    <div className="flex gap-1 animate-in slide-in-from-right-2">
                      <button onClick={(e) => {e.stopPropagation(); startEditing(tab);}} className="p-1 hover:bg-white/20 rounded-lg"><Edit2 size={12} /></button>
                      <button onClick={(e) => {e.stopPropagation(); onDeleteTab(tab.id);}} className="p-1 hover:bg-rose-500/20 text-rose-300 rounded-lg"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
                {activeTabId === tab.id && (
                  <div className="mt-2 ml-10 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black">
                      <Filter size={10} /> {tab.defaultFilter || 'recent'}
                    </div>
                    {addingSourceId === tab.id ? (
                      <div className="flex gap-1 px-2"><input autoFocus placeholder="@handle..." value={sourceHandle} onChange={e=>setSourceHandle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSource(tab.id)} className="bg-white/80 text-[10px] rounded-xl px-3 py-1.5 w-full outline-none" /><button onClick={()=>addSource(tab.id)} className="text-blue-600"><Check size={14}/></button></div>
                    ) : (
                      <button onClick={()=>setAddingSourceId(tab.id)} className="text-[10px] font-black text-blue-600/70 hover:text-blue-600 px-2">+ ADD HANDLE</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
        <div className="bg-white/60 backdrop-blur-lg p-4 rounded-3xl mb-4 border border-white/40 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-black">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-slate-900 truncate tracking-tight">{user.name}</p>
            <p className="text-[9px] text-blue-600 font-black">{user.finTokenBalance.toLocaleString()} FIN</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onOpenSettings} className="flex items-center justify-center gap-2 py-3 bg-white/80 rounded-2xl text-slate-600 text-xs font-black transition-all active:scale-95"><Settings size={16}/>SETUP</button>
          <button onClick={onLogout} className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-500 rounded-2xl text-xs font-black transition-all active:scale-95"><LogOut size={16}/>EXIT</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
