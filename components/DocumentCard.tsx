import React from 'react';
import { Document } from '../types';
import TrashIcon from './icons/TrashIcon';
import TagIcon from './icons/TagIcon';
import EyeIcon from './icons/EyeIcon';
import PdfIcon from './icons/PdfIcon';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onView: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, onView }) => {
  return (
    <div className="bg-brand-secondary rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-brand-accent/30 hover:scale-105">
      <div className="relative">
        <img src={document.thumbnailDataUrl} alt={document.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        {document.fileType === 'pdf' && (
          <div className="absolute top-2 left-2 bg-red-600/90 text-white rounded-md p-1">
            <PdfIcon className="w-5 h-5" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onView(document)} className="p-1.5 bg-black/50 rounded-full text-white hover:bg-brand-accent">
            <EyeIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(document.id)} className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-white">{document.title}</h3>
        <p className="text-sm text-slate-400 mb-2">{new Date(document.createdAt).toLocaleDateString()}</p>
        <div className="flex flex-wrap gap-1.5">
          {document.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
              <TagIcon className="w-3 h-3"/>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
