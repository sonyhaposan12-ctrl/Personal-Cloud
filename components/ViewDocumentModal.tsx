import React from 'react';
import { Document } from '../types';
import XIcon from './icons/XIcon';
import TagIcon from './icons/TagIcon';
import SendIcon from './icons/SendIcon';

interface ViewDocumentModalProps {
  document: Document;
  onClose: () => void;
  onSendRequest: (doc: Document) => void;
}

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({ document, onClose, onSendRequest }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] relative animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white">{document.title}</h2>
                 <p className="text-sm text-slate-400">{new Date(document.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSendRequest(document)} 
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                aria-label="Send via Email"
                title="Send via Email"
              >
                <SendIcon className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
                  <XIcon className="w-6 h-6" />
              </button>
            </div>
        </div>
        
        <div className="flex-grow overflow-y-auto bg-black/50">
           {document.fileType === 'pdf' ? (
             <iframe
                src={document.fileDataUrl}
                title={document.title}
                className="w-full h-full min-h-[75vh]"
                frameBorder="0"
             />
           ) : (
             <img 
                src={document.fileDataUrl} 
                alt={document.title} 
                className="w-full h-auto object-contain p-4" 
            />
           )}
        </div>

        <div className="p-4 bg-brand-primary/50 rounded-b-lg flex-shrink-0 border-t border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {document.tags.length > 0 ? document.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                <TagIcon className="w-4 h-4" />
                {tag}
              </span>
            )) : <span className="text-sm text-slate-500">No tags added.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;