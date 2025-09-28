import React, { useEffect, useRef, useState } from 'react';
import { Document } from '../types';
import XIcon from './icons/XIcon';
import TagIcon from './icons/TagIcon';
import SendIcon from './icons/SendIcon';

interface ViewDocumentModalProps {
  document: Document;
  onClose: () => void;
  onSendRequest: (doc: Document) => void;
}

const PdfViewer: React.FC<{ fileDataUrl: string }> = ({ fileDataUrl }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);


  useEffect(() => {
    const renderPdf = async () => {
      const canvasContainer = canvasContainerRef.current;
      if (!canvasContainer) return;
      
      // Clear previous content and reset state
      canvasContainer.innerHTML = '';
      setLoading(true);
      setError(null);
      setCurrentPage(0);
      setPageCount(0);

      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          throw new Error("pdf.js library is not loaded.");
        }
        
        // Decode Base64 to Uint8Array for pdf.js
        const pdfData = atob(fileDataUrl.substring(fileDataUrl.indexOf(',') + 1));
        const uint8Array = new Uint8Array(pdfData.length);
        for (let i = 0; i < pdfData.length; i++) {
          uint8Array[i] = pdfData.charCodeAt(i);
        }
        
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
        setPageCount(pdf.numPages);
        
        const scale = window.innerWidth > 1024 ? 1.5 : 1.0;

        // Render pages sequentially
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          // Check if component is still mounted before continuing
          if (!canvasContainerRef.current) break;

          setCurrentPage(pageNum);
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          canvas.className = 'mb-4 shadow-lg';
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not get canvas context');
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          
          canvasContainerRef.current?.appendChild(canvas);
        }

      } catch (err) {
        console.error('PDF rendering error:', err);
        setError('Failed to load PDF preview. The file may be corrupted or unsupported.');
      } finally {
        setLoading(false);
      }
    };
    
    renderPdf();

  }, [fileDataUrl]);

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      {loading && (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-8 h-8 border-4 border-slate-500 border-t-brand-accent rounded-full animate-spin"></div>
          <p className="mt-4">Loading PDF...</p>
          {pageCount > 0 && <p className="text-sm text-slate-400">Rendering page {currentPage} of {pageCount}</p>}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-full text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
      <div ref={canvasContainerRef} className={`flex flex-col items-center ${loading ? 'hidden' : ''}`}></div>
    </div>
  );
};


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
             <PdfViewer fileDataUrl={document.fileDataUrl} />
           ) : (
             <div className="w-full h-full flex items-center justify-center p-4">
                 <img 
                    src={document.fileDataUrl} 
                    alt={document.title} 
                    className="max-w-full max-h-full object-contain" 
                />
             </div>
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
