import React from 'react';
import { Folder } from '../types';
import InboxIcon from './icons/InboxIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import SendIcon from './icons/SendIcon';

interface SidebarProps {
  currentFolder: Folder;
  onFolderChange: (folder: Folder) => void;
}

const folders = [
  { id: 'inbox', name: 'Inbox', icon: InboxIcon },
  { id: 'sent', name: 'Sent', icon: SendIcon },
  { id: 'all', name: 'All Documents', icon: ArchiveIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentFolder, onFolderChange }) => {
  return (
    <aside className="w-64 bg-brand-secondary h-screen p-4 flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="bg-brand-accent p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2V7z" />
            </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Lemari Arsip</h1>
      </div>
      <nav>
        <ul>
          {folders.map(folder => {
            const isActive = currentFolder === folder.id;
            const Icon = folder.icon;
            return (
              <li key={folder.id} className="mb-1">
                <button
                  onClick={() => onFolderChange(folder.id as Folder)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-accent text-white' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{folder.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;