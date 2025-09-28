import React, { useState, useRef } from 'react';
import { Document } from '../types';
import XIcon from './icons/XIcon';
import CameraIcon from './icons/CameraIcon';
import FileIcon from './icons/FileIcon';
import CameraView from './CameraView';

interface UploadModalProps {
  onClose: () => void;
  onAdd: (doc: Document) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAdd }) => {
  const [mode, setMode] = useState<'options' | 'camera' | 'form' | 'processing'>('options');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [fullFileDataUrl, setFullFileDataUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [error, setError] = useState<string>('');
  const [fileToConfirm, setFileToConfirm] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetAndShowOptions = () => {
    setTitle('');
    setTags('');
    setPreview(null);
    setFullFileDataUrl(null);
    setFileType(null);
    setError('');
    setMode('options');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handlePdfFile = async (file: File) => {
    setMode('processing');
    try {
      const dataUrl = await readFileAsDataURL(file);
      setFullFileDataUrl(dataUrl);

      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        throw new Error("PDF processing library failed to load.");
      }

      // Decode Base64 to Uint8Array for pdf.js
      const pdfData = atob(dataUrl.substring(dataUrl.indexOf(',') + 1));
      const uint8Array = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        uint8Array[i] = pdfData.charCodeAt(i);
      }
      
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      const page = await pdf.getPage(1);
      
      const TARGET_THUMBNAIL_WIDTH = 400;
      const viewport = page.getViewport({ scale: 1.0 });
      const scale = TARGET_THUMBNAIL_WIDTH / viewport.width;
      const scaledViewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not get canvas context');
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      setPreview(thumbnailUrl);
      setFileType('pdf');
      setError('');
      setMode('form');
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Could not process the PDF file. It may be corrupted or unsupported.');
      resetAndShowOptions();
    }
  };

  const processFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit.');
      resetAndShowOptions();
      return;
    }

    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setPreview(dataUrl);
        setFullFileDataUrl(dataUrl);
        setFileType('image');
        setError('');
        setMode('form');
      } catch (readError) {
        console.error('Error reading image file:', readError);
        setError('Failed to read the image file.');
        resetAndShowOptions();
      }
    } else if (file.type === 'application/pdf') {
      handlePdfFile(file);
    } else {
      setError('Unsupported file type. Please upload an image or a PDF.');
      resetAndShowOptions();
    }
  };

  const handleConfirmUpload = () => {
    if (fileToConfirm) {
      processFile(fileToConfirm);
    }
    setFileToConfirm(null);
  };

  const handleCancelUpload = () => {
    setFileToConfirm(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileToConfirm(file);
  };

  const handleCapture = (dataUrl: string) => {
    setPreview(dataUrl);
    setFullFileDataUrl(dataUrl);
    setFileType('image');
    setMode('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !preview || !fullFileDataUrl || !fileType) {
      setError('Please add a title and an image/PDF for the document.');
      return;
    }

    const newDoc: Document = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      thumbnailDataUrl: preview,
      fileDataUrl: fullFileDataUrl,
      fileType: fileType,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: Date.now(),
      folder: 'inbox',
    };
    onAdd(newDoc);
    onClose();
  };

  const renderContent = () => {
    switch (mode) {
      case 'processing':
        return (
          <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-slate-500 border-t-brand-accent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300">Processing PDF...</p>
          </div>
        );
      case 'camera':
        return <CameraView onCapture={handleCapture} onCancel={() => setMode('options')} />;
      case 'form':
        return (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div className="relative w-full h-48 bg-brand-primary rounded-lg flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-md" />
                ) : (
                  <p className="text-slate-500">No image preview</p>
                )}
              </div>
               <button type="button" onClick={resetAndShowOptions} className="text-sm text-brand-accent hover:underline w-full text-center">
                Change File / Source
              </button>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Document Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  id="tags"
                  type="text"
                  placeholder="e.g., KTP, Pribadi, Kendaraan"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="p-4 bg-brand-primary/50 rounded-b-lg flex justify-end">
              <button type="submit" className="bg-brand-accent text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors">
                Save Document
              </button>
            </div>
          </form>
        );
      case 'options':
      default:
        return (
          <div className="p-8">
            {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="file" accept="image/*,application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-4 p-8 bg-brand-primary border-2 border-slate-600 rounded-lg text-slate-300 hover:border-brand-accent hover:text-white hover:bg-brand-secondary transition-all"
                >
                    <FileIcon className="w-12 h-12" />
                    <span className="text-lg font-semibold">Upload Documents</span>
                </button>
                <button
                    onClick={() => setMode('camera')}
                    className="flex flex-col items-center justify-center gap-4 p-8 bg-brand-primary border-2 border-slate-600 rounded-lg text-slate-300 hover:border-brand-accent hover:text-white hover:bg-brand-secondary transition-all"
                >
                    <CameraIcon className="w-12 h-12" />
                    <span className="text-lg font-semibold">Scan with Camera</span>
                </button>
            </div>
           </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Add New Document</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        {renderContent()}

        {fileToConfirm && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand-secondary/80 backdrop-blur-sm rounded-lg animate-fade-in-up">
            <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-sm border border-slate-700 mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white text-center">Confirm Upload</h3>
                <p className="mt-2 text-slate-300 text-center">Are you sure you want to proceed with this file?</p>
                <div className="mt-4 bg-brand-primary/80 p-3 rounded-lg border border-slate-700 space-y-1">
                  <p className="text-slate-200 truncate font-medium">
                    <span className="font-normal text-slate-400">File: </span> 
                    {fileToConfirm.name}
                  </p>
                  <p className="text-slate-400">
                    <span>Size: </span> 
                    {(fileToConfirm.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="p-4 bg-brand-primary/50 rounded-b-lg flex justify-end gap-4">
                <button onClick={handleCancelUpload} className="font-semibold py-2 px-4 rounded-md hover:bg-slate-700 transition-colors text-slate-300">Cancel</button>
                <button onClick={handleConfirmUpload} className="bg-brand-accent text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;