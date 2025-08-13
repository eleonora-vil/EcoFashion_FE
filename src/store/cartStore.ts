import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  unit: string; // Đơn vị: "mét", "cái", "kg", etc.
  type: string; // Loại sản phẩm: "material", "product", "design", etc.
  sellerId: string; // Nhà cung cấp/nhà thiết kế
  sellerName?: string;
}

interface CartState {
  items: CartItem[];
  // Nhóm theo seller để hiển thị/checkout từng đơn
  getItemsGroupedBySeller: () => Record<string, CartItem[]>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getItemCount: () => number; // Số loại sản phẩm khác nhau
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  getItemsGroupedBySeller: () => {
    const groups: Record<string, CartItem[]> = {};
    get().items.forEach((item) => {
      if (!groups[item.sellerId]) groups[item.sellerId] = [];
      groups[item.sellerId].push(item);
    });
    return groups;
  },
  addToCart: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    }
    return { items: [...state.items, item] };
  }),
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  clearCart: () => set({ items: [] }),
  getTotalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getItemCount: () => get().items.length, // Số loại sản phẩm khác nhau
  increaseQuantity: (id) => set((state) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return {};
  }),
  decreaseQuantity: (id) => set((state) => {
    const item = state.items.find((i) => i.id === id);
    if (item && item.quantity > 1) {
      return {
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    } else if (item && item.quantity === 1) {
      return {
        items: state.items.filter((i) => i.id !== id),
      };
    }
    return {};
  }),
}));
