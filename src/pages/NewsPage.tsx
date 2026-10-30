import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { NewsPost } from '../types';
import { INITIAL_NEWS } from '../lib/constants';
import { Newspaper, Calendar, User, ArrowRight, X } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>(INITIAL_NEWS);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

  useEffect(() => {
    db.getNewsPosts().then(setPosts);
    const handleUpdate = () => db.getNewsPosts().then(setPosts);
    window.addEventListener('colls_db_updated', handleUpdate);
    return () => window.removeEventListener('colls_db_updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Newspaper className="w-4 h-4" />
            <span>Colls Records Newsroom</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            Latest News &amp; Updates
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            Announcements, studio developments, production workshops, and artist milestones from Tanga.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="glass-panel rounded-3xl overflow-hidden border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-neutral-900 border-b border-neutral-800">
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-neutral-950/80 px-2.5 py-1 rounded text-[10px] font-mono uppercase text-amber-400 border border-neutral-800">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{post.published_at}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{post.author}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/30 text-amber-400 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal for Full Article View */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 max-w-2xl w-full rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPost(null)}
                aria-label="Close article modal"
                className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-neutral-950 border border-neutral-800">
                <img
                  src={selectedPost.cover_url}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mb-2">
                <span className="text-amber-400">{selectedPost.category}</span>
                <span>·</span>
                <span>{selectedPost.published_at}</span>
                <span>·</span>
                <span>{selectedPost.author}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                {selectedPost.title}
              </h2>

              <div className="text-sm text-neutral-300 leading-relaxed space-y-4 whitespace-pre-line">
                {selectedPost.content}
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
