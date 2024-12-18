import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDiamondStore } from '../lib/store';

type PurchaseOption = {
  amount: number;
  price: number;
  bonus?: number;
};

const PURCHASE_OPTIONS: PurchaseOption[] = [
  { amount: 100, price: 0.99 },
  { amount: 200, price: 1.99, bonus: 20 },
  { amount: 500, price: 4.99, bonus: 75 },
  { amount: 1000, price: 9.99, bonus: 200 },
];

interface DiamondsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

export default function DiamondsModal({ isOpen, onClose, onPurchase }: DiamondsModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { resetDiamonds } = useDiamondStore();

  const handlePurchase = async () => {
    if (!selectedAmount) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPurchase(selectedAmount);
      onClose();
      setSelectedAmount(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-blue-900 rounded-2xl p-6 max-w-md w-full shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold text-gold-300">
              Purchase Diamonds 💎
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Preset amounts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {PURCHASE_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => {
                  setSelectedAmount(option.amount);
                }}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${selectedAmount === option.amount
                    ? 'border-amber-500 bg-amber-500/20'
                    : 'border-blue-800 hover:border-amber-500/50'
                  }
                `}
              >
                <div className="text-xl font-bold text-white">{option.amount} 💎</div>
                <div className="text-blue-200">${option.price.toFixed(2)}</div>
                {option.bonus && (
                  <div className="text-amber-400 text-sm">+{option.bonus} bonus!</div>
                )}
              </button>
            ))}
          </div>

          {/* Payment method */}
          <div className="mb-6">
            <label className="block text-blue-200 mb-2">Payment Method</label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`
                  flex-1 p-3 rounded-lg border transition-all
                  ${paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/20'
                    : 'border-blue-800 hover:border-amber-500/50'
                  }
                `}
              >
                <span className="text-white">Credit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`
                  flex-1 p-3 rounded-lg border transition-all
                  ${paymentMethod === 'crypto'
                    ? 'border-amber-500 bg-amber-500/20'
                    : 'border-blue-800 hover:border-amber-500/50'
                  }
                `}
              >
                <span className="text-white">Crypto</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-800/50 transition-colors text-white"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !selectedAmount}
              className={`
                flex-1 px-4 py-2 rounded-lg font-bold transition-all text-white
                ${isProcessing || !selectedAmount
                  ? 'bg-amber-500/50 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400'
                }
              `}
            >
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>

          {/* Testing Tools Section */}
          <div className="mt-8 pt-4 border-t border-blue-800">
            <div className="text-xs text-blue-400/50 mb-2">Developer Tools</div>
            <button
              onClick={() => {
                resetDiamonds();
                onClose();
              }}
              className="w-full px-3 py-1.5 rounded text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300/50 hover:text-red-300/80 transition-colors"
            >
              Reset Diamonds (Testing Only)
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}