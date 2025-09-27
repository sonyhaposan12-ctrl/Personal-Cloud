import React from 'react';
import { Document } from '../types';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onView: (doc: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete, onView }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-300">No Documents Found</h2>
        <p className="text-slate-400 mt-2">Your digital vault is empty, or no documents match your search.</p>
        <p className="text-slate-400">Click the "Add" button to upload your first document.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {documents.map(doc => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onDelete={onDelete} 
          onView={onView} 
        />
      ))}
    </div>
  );
};

export default DocumentList;
