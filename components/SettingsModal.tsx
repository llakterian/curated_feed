
import React, { useState } from 'react';
import { User } from '../types';
import { X, Camera, Save, User as UserIcon } from 'lucide-react';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updates: Partial<User>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({ name, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] w-full max-w-md p-10 shadow-2xl relative border border-white/20 scale-in-center overflow-hidden">
        {/* Abstract bg decor */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">Profile Settings</h2>

        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-slate-100 ring-4 ring-white shadow-xl transition-all group-hover:scale-105">
                {avatar ? (
                  <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[32px] transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="mt-3 text-xs font-black text-blue-600 uppercase tracking-widest">Update Avatar</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50/80 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 shadow-inner transition-all"
              placeholder="Your on-chain name"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl font-black text-xs text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              SAVE PROFILE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
