
import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, Share2, MessageCircle, Bookmark, ExternalLink, Send, X, Copy, Check, Hash, Plus } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onAddTag: (postId: string, tag: string) => void;
  onFilterByTag?: (tag: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onBookmark, onAddTag, onFilterByTag }) => {
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      onAddTag(post.id, newTag.trim().toLowerCase());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  return (
    <div className="group relative bg-white/50 backdrop-blur-lg border border-white/80 p-5 md:p-6 mb-4 rounded-[28px] md:rounded-[40px] hover:bg-white/80 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex md:flex-col items-center gap-3 md:gap-0">
          <img src={post.authorAvatar} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] shadow-sm border-4 border-white object-cover" />
          <div className="flex md:hidden flex-col">
            <span className="font-black text-slate-900 text-sm">{post.authorName}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">@{post.authorHandle}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="hidden md:flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 tracking-tight">{post.authorName}</span>
              <span className="text-slate-400 text-xs font-bold">@{post.authorHandle}</span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-slate-400 text-xs font-medium">{post.timestamp}</span>
            </div>
            <button className="text-slate-300 hover:text-blue-600 transition-colors"><ExternalLink size={14}/></button>
          </div>

          <p className="text-slate-800 text-base md:text-lg font-medium leading-relaxed mb-4 md:mb-6 selection:bg-blue-100">
            {post.content}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(t => (
              <button key={t} onClick={() => onFilterByTag?.(t)} className="flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white px-2 py-1 rounded-lg transition-all">
                <Hash size={10} />{t}
              </button>
            ))}
            {showTagInput ? (
              <form onSubmit={handleAddTag}><input autoFocus value={newTag} onChange={(e)=>setNewTag(e.target.value)} onBlur={()=>setShowTagInput(false)} className="text-[10px] bg-slate-100/50 rounded-lg px-2 py-1 w-16 outline-none font-bold" placeholder="..." /></form>
            ) : (
              <button onClick={()=>setShowTagInput(true)} className="p-1 text-slate-300 hover:text-blue-500 transition-colors"><Plus size={14}/></button>
            )}
          </div>

          <div className="flex items-center justify-between max-w-sm md:max-w-md">
            <button onClick={() => onLike(post.id)} className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all duration-300 group/btn ${post.isLiked ? 'bg-rose-50 text-rose-500 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} className={`${post.isLiked ? 'animate-bounce' : 'group-hover/btn:scale-125 transition-transform'}`} />
              <span className="text-xs font-black">{post.likes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 p-2.5 rounded-2xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"><MessageCircle size={20}/><span className="text-xs font-black">42</span></button>
            <button onClick={() => setShowShareModal(true)} className="p-2.5 rounded-2xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90"><Share2 size={20}/></button>
            <button onClick={() => onBookmark(post.id)} className={`p-2.5 rounded-2xl transition-all active:scale-90 ${post.isBookmarked ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-blue-50'}`}><Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'}/></button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-black mb-4">Share Signal</h3>
            <div className="bg-slate-50 p-4 rounded-3xl mb-6 flex justify-between items-center">
              <span className="text-xs font-medium truncate text-slate-500">{post.content.slice(0, 40)}...</span>
              <button onClick={()=>{navigator.clipboard.writeText(post.content); setCopied(true); setTimeout(()=>setCopied(false), 2000)}} className="text-blue-600">{copied ? <Check size={18}/> : <Copy size={18}/>}</button>
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs active:scale-95 transition-all">TWITTER (X)</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
