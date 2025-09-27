import React from 'react';
import { SubscriptionStatus, BiometricConfig } from '../types';
import XIcon from './icons/XIcon';
import StarIcon from './icons/StarIcon';
import FingerprintIcon from './icons/FingerprintIcon';
import ToggleSwitch from './ToggleSwitch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionStatus: SubscriptionStatus;
  biometricConfig: BiometricConfig;
  onBiometricToggle: (isEnabled: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  subscriptionStatus,
  biometricConfig,
  onBiometricToggle,
}) => {
  if (!isOpen) return null;

  const canEnableBiometrics = subscriptionStatus === 'premium' && biometricConfig.isSupported;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Subscription Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Subscription</h3>
            <div className="bg-brand-primary/50 p-4 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Current Status:</span>
              {subscriptionStatus === 'premium' ? (
                 <div className="flex items-center gap-2 text-sm text-yellow-400 font-semibold">
                  <StarIcon className="w-5 h-5" />
                  <span>Premium</span>
                </div>
              ) : (
                <span className="font-semibold text-white">Free Tier</span>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
            <div className="bg-brand-primary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FingerprintIcon className="w-6 h-6 text-slate-300" />
                        <label htmlFor="biometric-toggle" className="font-medium text-white">
                            Biometric Login
                        </label>
                    </div>
                    <ToggleSwitch 
                        id="biometric-toggle"
                        checked={biometricConfig.isEnabled && canEnableBiometrics}
                        onChange={onBiometricToggle}
                        disabled={!canEnableBiometrics}
                    />
                </div>
                <p className="text-sm text-slate-400 mt-2 pl-9">
                    {subscriptionStatus === 'free'
                        ? 'Upgrade to Premium to enable this feature.'
                        : !biometricConfig.isSupported
                        ? 'Biometric login is not supported by your browser or device.'
                        : 'Require fingerprint or face ID to unlock the app.'}
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
