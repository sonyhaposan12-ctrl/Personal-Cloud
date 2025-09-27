import React, { useState } from 'react';
import { Document } from '../types';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';

interface SendEmailModalProps {
  document: Document;
  onClose: () => void;
  onSend: (documentId: string) => void;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ document, onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState(document.title);
  const [body, setBody] = useState(`Attached is the document: ${document.title}`);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !/^\S+@\S+\.\S+$/.test(recipient)) {
      setError('Please enter a valid recipient email address.');
      return;
    }
    setError('');
    setIsSending(true);

    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSend(document.id);
    // No need to set isSending to false as the component will unmount
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-xl relative animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SendIcon className="w-6 h-6"/>
            Send Document
          </h2>
          <button onClick={onClose} disabled={isSending} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full disabled:opacity-50">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex gap-4 items-start">
                <img src={document.thumbnailDataUrl} alt={document.title} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1">
                    <h3 className="font-semibold text-white">{document.title}</h3>
                    <p className="text-sm text-slate-400">{document.fileType.toUpperCase()} Document</p>
                </div>
            </div>
            
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-slate-300 mb-1">To</label>
              <input
                id="recipient"
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
                required
              />
            </div>
             <div>
              <label htmlFor="body" className="block text-sm font-medium text-slate-300 mb-1">Body</label>
              <textarea
                id="body"
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-brand-primary border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-brand-accent focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="p-4 bg-brand-primary/50 rounded-b-lg flex justify-end items-center gap-4">
             <button type="button" onClick={onClose} disabled={isSending} className="text-slate-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50">
                Cancel
              </button>
            <button 
                type="submit" 
                className="bg-brand-accent text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:bg-slate-500 disabled:cursor-wait"
                disabled={isSending}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-5 h-5"/>
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendEmailModal;
