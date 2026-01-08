
import React, { useState } from 'react';
import { User } from '../types';

interface WalletGateProps {
  onConnect: (user: User) => void;
}

const WalletGate: React.FC<WalletGateProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate EVM wallet connection and token check on Base L2
    setTimeout(() => {
      onConnect({
        id: 'user_1',
        name: 'Base Navigator',
        walletAddress: '0x3f5...8e1a',
        finTokenBalance: 2500 // Above the required threshold
      });
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Curated Feed</h1>
          <p className="text-lg text-slate-500">Restore your digital autonomy on <b>Base</b>. Connect your EVM wallet to verify your <b>FIN</b> holdings.</p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Required Access:</span>
              <span className="text-blue-600 font-bold">500 FIN</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[100%]"></div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking FIN Balance...
              </>
            ) : (
              'Connect with Coinbase / MetaMask'
            )}
          </button>
          
          <p className="mt-4 text-xs text-slate-400">
            Authenticated via Base L2. No data leaves your control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4">
            <h3 className="font-bold text-slate-800">FIN Powered</h3>
            <p className="text-xs text-slate-500">Exclusive access for the FIN community.</p>
          </div>
          <div className="p-4 border-l border-slate-200">
            <h3 className="font-bold text-slate-800">Base L2</h3>
            <p className="text-xs text-slate-500">Low fees, high speed, decentralized trust.</p>
          </div>
          <div className="p-4 border-l border-slate-200">
            <h3 className="font-bold text-slate-800">AI Signal</h3>
            <p className="text-xs text-slate-500">Gemini-powered summaries for busy traders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletGate;
