import { create } from 'zustand';
import type { CheckoutOrderDto, CreateSessionResponse } from '../services/api/checkoutService';

interface CheckoutWizardState {
  orderGroupId?: string;
  orders: CheckoutOrderDto[];
  currentIndex: number;
  statusByOrderId: Record<number, 'Pending' | 'Paid' | 'Failed' | 'Expired' | 'Skipped'>;
  expiresAt?: string;
  start: (resp: CreateSessionResponse) => void;
  markStatus: (orderId: number, status: 'Pending' | 'Paid' | 'Failed' | 'Expired' | 'Skipped') => void;
  next: () => void;
  reset: () => void;
  goToOrder: (orderId: number) => void;
}

export const useCheckoutWizard = create<CheckoutWizardState>((set, get) => ({
  orders: [],
  currentIndex: 0,
  statusByOrderId: {},
  start: (resp) => set({
    orderGroupId: resp.orderGroupId,
    orders: resp.orders,
    currentIndex: 0,
    statusByOrderId: resp.orders.reduce((acc, o) => { acc[o.orderId] = 'Pending'; return acc; }, {} as Record<number, any>),
    expiresAt: resp.expiresAt,
  }),
  markStatus: (orderId, status) => set((s) => ({
    statusByOrderId: { ...s.statusByOrderId, [orderId]: status },
  })),
  next: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.orders.length) })),
  reset: () => set({ orderGroupId: undefined, orders: [], currentIndex: 0, statusByOrderId: {}, expiresAt: undefined }),
  goToOrder: (orderId) => set((s) => {
    const idx = s.orders.findIndex(o => o.orderId === orderId);
    return idx >= 0 ? { currentIndex: idx } : {} as any;
  }),
}));


