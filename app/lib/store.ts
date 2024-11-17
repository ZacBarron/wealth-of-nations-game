import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DiamondState {
  balance: number;
  addDiamonds: (amount: number) => void;
  spendDiamonds: (amount: number) => boolean;
  resetDiamonds: () => void;
}

export const useDiamondStore = create<DiamondState>()(
  persist(
    (set) => ({
      balance: 0,
      addDiamonds: (amount) => 
        set((state) => ({ balance: state.balance + amount })),
      spendDiamonds: (amount) => {
        let success = false;
        set((state) => {
          if (state.balance >= amount) {
            success = true;
            return { balance: state.balance - amount };
          }
          return state;
        });
        return success;
      },
      resetDiamonds: () => set({ balance: 0 })
    }),
    {
      name: 'diamond-storage',
    }
  )
);