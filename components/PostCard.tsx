
import React from 'react';
import { Post } from '../types';
import { Heart, Share2, MessageCircle, Bookmark, ExternalLink } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onBookmark }) => {
  return (
    <div className="group relative bg-white/40 backdrop-blur-lg border border-white/60 p-6 mb-4 rounded-[32px] hover:bg-white/60 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
      <div className="flex gap-5">
        <div className="relative">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="w-14 h-14 rounded-2xl ring-4 ring-white/80 object-cover flex-shrink-0 shadow-sm"
          />
          <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg shadow-sm border border-white ${
            post.source === 'X' ? 'bg-black' : post.source === 'RSS' ? 'bg-orange-500' : 'bg-red-600'
          }`}>
             <span className="text-[8px] font-black text-white uppercase px-1">{post.source}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-black text-slate-900 truncate tracking-tight">{post.authorName}</span>
              <span className="text-slate-400 text-xs font-bold truncate">@{post.authorHandle}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 text-xs font-medium whitespace-nowrap">{post.timestamp}</span>
            </div>
            <button className="text-slate-300 hover:text-blue-500 transition-colors">
              <ExternalLink size={14} />
            </button>
          </div>
          <p className="text-slate-800 leading-relaxed mb-6 text-lg font-medium selection:bg-blue-100 selection:text-blue-900">
            {post.content}
          </p>
          <div className="flex items-center justify-between max-w-sm">
            <button 
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                post.isLiked ? 'bg-rose-50 text-rose-500' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} className={post.isLiked ? 'animate-bounce' : ''} />
              <span className="text-sm font-black tracking-tighter">{post.likes > 1000 ? (post.likes/1000).toFixed(1) + 'k' : post.likes}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
              <MessageCircle size={18} />
              <span className="text-sm font-black tracking-tighter">42</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => onBookmark(post.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                post.isBookmarked ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <Bookmark size={18} fill={post.isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
