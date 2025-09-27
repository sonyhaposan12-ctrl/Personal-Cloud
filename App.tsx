import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Document, SubscriptionStatus, BiometricConfig, Folder } from './types';
import { FREE_TIER_LIMIT } from './constants';
import Header from './components/Header';
import DocumentList from './components/DocumentList';
import UploadModal from './components/UploadModal';
import ViewDocumentModal from './components/ViewDocumentModal';
import UpgradeBanner from './components/UpgradeBanner';
import SettingsModal from './components/SettingsModal';
import LockScreen from './components/LockScreen';
import Sidebar from './components/Sidebar';
import SendEmailModal from './components/SendEmailModal';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('free');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentFolder, setCurrentFolder] = useState<Folder>('inbox');
  const [isUploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [documentToSend, setDocumentToSend] = useState<Document | null>(null);
  const [biometricConfig, setBiometricConfig] = useState<BiometricConfig>({ isSupported: false, isEnabled: false });
  const [isLocked, setLocked] = useState<boolean>(true);
  const [appInitialized, setAppInitialized] = useState<boolean>(false);

  // Check for biometric support and load settings on mount
  useEffect(() => {
    const initializeApp = async () => {
      let isSupported = false;
      if (window.PublicKeyCredential && typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        try {
          isSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch (e) {
          console.error("Error checking biometric support:", e);
        }
      }
      
      const storedSub = localStorage.getItem('digital_vault_sub') as SubscriptionStatus || 'free';
      const storedDocs = JSON.parse(localStorage.getItem('digital_vault_docs') || '[]');
      const storedBiometricEnabled = localStorage.getItem('digital_vault_biometric_enabled') === 'true';
      
      // Simple migration for documents without a folder
      const migratedDocs = storedDocs.map((doc: Document) => ({
        ...doc,
        folder: doc.folder || 'inbox'
      }));

      setSubscriptionStatus(storedSub);
      setDocuments(migratedDocs);
      setBiometricConfig({ isSupported, isEnabled: storedBiometricEnabled });

      if (storedSub === 'premium' && storedBiometricEnabled && isSupported) {
        setLocked(true);
      } else {
        setLocked(false);
      }
      setAppInitialized(true);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!appInitialized) return;
    try {
      localStorage.setItem('digital_vault_docs', JSON.stringify(documents));
    } catch (error) {
      console.error("Failed to save documents to localStorage", error);
    }
  }, [documents, appInitialized]);

  useEffect(() => {
    if (!appInitialized) return;
    try {
      localStorage.setItem('digital_vault_sub', subscriptionStatus);
    } catch (error) {
      console.error("Failed to save subscription status to localStorage", error);
    }
  }, [subscriptionStatus, appInitialized]);
  
  const handleAddDocument = (doc: Document) => {
    setDocuments(prevDocs => [doc, ...prevDocs]);
    setCurrentFolder('inbox'); // Switch to inbox to show the new doc
  };

  const handleDeleteDocument = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    }
  }, []);

  const handleViewDocument = useCallback((doc: Document) => {
    setViewingDocument(doc);
  }, []);

  const handleUpgrade = () => {
    setSubscriptionStatus('premium');
  };

  const handleBiometricToggle = (isEnabled: boolean) => {
    localStorage.setItem('digital_vault_biometric_enabled', String(isEnabled));
    setBiometricConfig(prev => ({ ...prev, isEnabled }));
    if (!isEnabled) {
      setLocked(false); // Immediately unlock if disabled
    }
  };

  const handleUnlock = useCallback(async () => {
    if (!biometricConfig.isSupported) {
        setLocked(false);
        return;
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [],
          userVerification: 'required',
        },
      });
      
      if (credential) {
        setLocked(false);
      }
    } catch (err) {
      console.error('Biometric authentication failed:', err);
      // Let LockScreen handle the error display
      throw err;
    }
  }, [biometricConfig.isSupported]);

  const handleInitiateSend = (doc: Document) => {
    setViewingDocument(null); // Close the view modal
    setDocumentToSend(doc);
  };

  const handleConfirmSend = (docId: string) => {
    setDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId ? { ...doc, folder: 'sent' } : doc
      )
    );
    setDocumentToSend(null);
    setCurrentFolder('sent'); // Switch to sent folder
  };

  const documentsInFolder = useMemo(() => {
    if (currentFolder === 'all') {
      return documents;
    }
    return documents.filter(doc => doc.folder === currentFolder);
  }, [documents, currentFolder]);

  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documentsInFolder;
    return documentsInFolder.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [documentsInFolder, searchTerm]);

  const canUpload = useMemo(() => {
    if (subscriptionStatus === 'premium') return true;
    return documents.length < FREE_TIER_LIMIT;
  }, [documents.length, subscriptionStatus]);

  if (!appInitialized) {
    return <div className="min-h-screen bg-brand-primary" />; // Or a loading spinner
  }

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-brand-primary flex">
      <Sidebar 
        currentFolder={currentFolder}
        onFolderChange={(folder) => setCurrentFolder(folder)}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Header 
          onSearch={setSearchTerm} 
          onAddClick={() => setUploadModalOpen(true)}
          onSettingsClick={() => setSettingsModalOpen(true)}
          canUpload={canUpload}
          docCount={documents.length}
          subStatus={subscriptionStatus}
        />
        <main className="flex-1 overflow-y-auto container mx-auto px-4 py-8">
          {subscriptionStatus === 'free' && (
            <UpgradeBanner 
              docCount={documents.length}
              limit={FREE_TIER_LIMIT}
              onUpgrade={handleUpgrade}
            />
          )}
          <DocumentList 
            documents={filteredDocuments}
            onDelete={handleDeleteDocument}
            onView={handleViewDocument}
          />
        </main>
      
        <footer className="text-center py-4 text-slate-500 text-sm flex-shrink-0">
          <p>Disclaimer: Documents are stored locally in your browser. This is a demo application and not a truly encrypted secure vault.</p>
        </footer>
      </div>

      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setUploadModalOpen(false)}
          onAdd={handleAddDocument}
        />
      )}

      {viewingDocument && (
        <ViewDocumentModal
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
          onSendRequest={handleInitiateSend}
        />
      )}

      {documentToSend && (
        <SendEmailModal
          document={documentToSend}
          onClose={() => setDocumentToSend(null)}
          onSend={handleConfirmSend}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          subscriptionStatus={subscriptionStatus}
          biometricConfig={biometricConfig}
          onBiometricToggle={handleBiometricToggle}
        />
      )}
    </div>
  );
};

export default App;