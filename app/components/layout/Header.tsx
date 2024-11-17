"use client";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useLogout } from "@account-kit/react";
import { useDiamondStore } from '../../lib/store';
import DiamondsModal from '../DiamondsModal';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Header({ title = "Dashboard" }) {
  const { logout } = useLogout();
  const [isDiamondsModalOpen, setIsDiamondsModalOpen] = useState(false);
  const { balance, addDiamonds } = useDiamondStore();

  const handlePurchaseDiamonds = (amount: number) => {
    addDiamonds(amount);
    toast.success(`Successfully purchased ${amount} diamonds! 💎`);
    
    // Dispatch event for activity log
    window.dispatchEvent(new CustomEvent('diamondsPurchased', {
      detail: {
        amount,
        timestamp: new Date().toISOString()
      }
    }));
  };

  return (
    <div className="bg-blue-900 border-b border-blue-800">
      <div className="py-4 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-8">
          {/* Diamonds balance and purchase button */}
          <div className="flex items-center h-11 rounded-lg overflow-hidden">
            {/* Balance display */}
            <div className="flex items-center gap-1 px-3 h-full bg-blue-800/50">
              <span className="text-white font-medium">{balance}</span>
              <span className="text-lg">💎</span>
            </div>
            
            {/* Purchase button - now using amber CTA styling */}
            <button
              onClick={() => setIsDiamondsModalOpen(true)}
              className="h-full px-3 bg-amber-500 hover:bg-amber-400 transition-colors"
            >
              <span className="text-white text-lg font-bold">+</span>
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 h-11 rounded-lg bg-blue-800/50 hover:bg-blue-800 text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
      <DiamondsModal
        isOpen={isDiamondsModalOpen}
        onClose={() => setIsDiamondsModalOpen(false)}
        onPurchase={handlePurchaseDiamonds}
      />
    </div>
  );
}
