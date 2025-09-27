import React, { useState, useEffect } from 'react';
import FingerprintIcon from './icons/FingerprintIcon';

interface LockScreenProps {
  onUnlock: () => Promise<void>;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleUnlockAttempt = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      await onUnlock();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Authentication cancelled.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    handleUnlockAttempt();
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-primary z-[100] flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-fade-in-up">
        <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-brand-secondary text-brand-accent">
          <FingerprintIcon className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Authentication Required</h1>
        <p className="text-slate-400 mb-8">Please use biometrics to unlock your digital vault.</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button 
          onClick={handleUnlockAttempt}
          disabled={isAuthenticating}
          className="bg-brand-accent text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-500 transition-all disabled:bg-slate-500 disabled:cursor-wait w-full max-w-xs"
        >
          {isAuthenticating ? 'Authenticating...' : 'Retry Authentication'}
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
