'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Code2, ArrowRight, X } from 'lucide-react';

interface UsernameModalProps {
  onUsernameSet: (username: string) => void;
  onClose?: () => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onUsernameSet, onClose }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus the input on mount
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = value.trim();
    if (!username) return;

    setLoading(true);
    // Save username to localStorage immediately
    localStorage.setItem('cpp_odyssey_username', username);
    onUsernameSet(username);
    setLoading(false);
  };

  return (
    /* Semi-transparent overlay, modal centred but not full-screen takeover */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-lg shadow-md p-5 sm:p-7 flex flex-col items-center gap-4 sm:gap-5 relative max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Logo mark */}
        <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400 font-black shadow-sm">
          <Code2 className="w-5 h-5" />
        </div>

        <div className="text-center">
          <h1
            id="username-modal-title"
            className="text-base font-bold text-zinc-100 mb-1 tracking-tight"
          >
            Welcome to C++ Odyssey
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Enter a username to track your progress across devices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. ali_nust or bytewizard"
            maxLength={40}
            autoComplete="username"
            spellCheck={false}
            aria-label="Enter your username"
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-sm sm:text-xs text-zinc-100 placeholder:text-zinc-500 transition-colors font-mono"
          />
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-sm sm:text-xs transition-colors shadow-sm active:scale-[0.98]"
          >
            <span>{loading ? 'Loading…' : 'Start Learning'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[11px] text-zinc-400 text-center">
          No password required. Progress syncs if cloud database is configured.
        </p>
      </div>
    </div>
  );
};
