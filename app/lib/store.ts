import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiamondState {
  balance: number;
  addDiamonds: (amount: number) => void;
  spendDiamonds: (amount: number) => boolean;
}

export const useDiamondStore = create<DiamondState>()(
  persist(
    (set, get) => ({
      balance: 0,
      addDiamonds: (amount) => 
        set((state) => ({ balance: state.balance + amount })),
      spendDiamonds: (amount) => {
        const currentBalance = get().balance;
        if (currentBalance >= amount) {
          set({ balance: currentBalance - amount });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'diamond-storage',
    }
  )
);