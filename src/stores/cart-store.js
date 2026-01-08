import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
}));

export default useCartStore;
