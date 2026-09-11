'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Code2, ArrowRight } from 'lucide-react';

interface UsernameModalProps {
  onUsernameSet: (username: string) => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onUsernameSet }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus the input on mount
    inputRef.current?.focus();
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-[#0e1424] border border-slate-800 rounded-2xl shadow-md p-8 flex flex-col items-center gap-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
      >
        {/* Logo mark */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
          <Code2 className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h1
            id="username-modal-title"
            className="text-lg font-bold text-white mb-1"
          >
            Welcome to C++ Odyssey
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
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
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500/60 focus:outline-none text-sm text-slate-100 placeholder:text-slate-500 transition"
          />
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition shadow-sm"
          >
            <span>{loading ? 'Loading…' : 'Start Learning'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          No password required. Progress syncs if Upstash is configured.
        </p>
      </div>
    </div>
  );
};
