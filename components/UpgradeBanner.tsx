import React from 'react';
import StarIcon from './icons/StarIcon';
import LockIcon from './icons/LockIcon';
import { FREE_TIER_LIMIT } from '../constants';


interface UpgradeBannerProps {
    docCount: number;
    limit: number;
    onUpgrade: () => void;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ docCount, limit, onUpgrade }) => {
    const isLimitReached = docCount >= limit;

    return (
        <div className={`mb-8 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-800 to-brand-secondary border ${isLimitReached ? 'border-red-500' : 'border-slate-700'}`}>
            <div className="flex items-center gap-4">
                <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-400">
                    <StarIcon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Go Premium for Unlimited Access</h3>
                    <p className="text-slate-300">Unlock unlimited document storage and advanced security features.</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                 <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${(docCount / limit) * 100}%` }}></div>
                </div>
                <button 
                    onClick={onUpgrade}
                    className="flex items-center gap-2 bg-yellow-500 text-brand-primary font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-transform hover:scale-105"
                >
                    <LockIcon className="w-5 h-5"/>
                    <span>Upgrade Now</span>
                </button>
            </div>
        </div>
    );
};

export default UpgradeBanner;
