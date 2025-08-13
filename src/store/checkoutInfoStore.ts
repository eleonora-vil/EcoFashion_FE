import { create } from 'zustand';

interface ShippingInfo {
  fullName: string;
  phone: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine: string;
}

interface CheckoutInfoState {
  shipping?: ShippingInfo;
  setShipping: (info: ShippingInfo) => void;
  clear: () => void;
}

export const useCheckoutInfoStore = create<CheckoutInfoState>((set) => ({
  shipping: undefined,
  setShipping: (info) => set({ shipping: info }),
  clear: () => set({ shipping: undefined }),
}));


