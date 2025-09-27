import React from 'react';
import PlusIcon from './icons/PlusIcon';
import SearchIcon from './icons/SearchIcon';
import StarIcon from './icons/StarIcon';
import SettingsIcon from './icons/SettingsIcon';
import { SubscriptionStatus } from '../types';
import { FREE_TIER_LIMIT } from '../constants';

interface HeaderProps {
  onSearch: (term: string) => void;
  onAddClick: () => void;
  onSettingsClick: () => void;
  canUpload: boolean;
  docCount: number;
  subStatus: SubscriptionStatus;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onAddClick, onSettingsClick, canUpload, docCount, subStatus }) => {
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-20 shadow-lg flex-shrink-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-end gap-4">
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
              {subStatus === 'premium' ? (
                <div className="flex items-center gap-2 text-sm text-yellow-400 font-semibold">
                  <StarIcon className="w-5 h-5" />
                  <span>Premium</span>
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  <span className="font-bold text-white">{docCount}</span> / {FREE_TIER_LIMIT} Docs
                </div>
              )}
            </div>
            <button
              onClick={onSettingsClick}
              className="flex items-center justify-center w-10 h-10 bg-slate-700/50 text-slate-300 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
              aria-label="Open settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onAddClick}
              disabled={!canUpload}
              className="flex items-center gap-2 bg-brand-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
