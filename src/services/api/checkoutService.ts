import apiClient from './baseApi';

export interface CartItemDto {
  itemType: 'material' | 'design';
  materialId?: number;
  designId?: number;
  sellerId?: string; // GUID
  sellerType: 'Supplier' | 'Designer';
  quantity: number;
  unitPrice: number;
}

export interface CreateSessionRequest {
  items: CartItemDto[];
  shippingAddress: string;
  holdMinutes?: number;
}

export interface CheckoutOrderDto {
  orderId: number;
  sellerType: string;
  sellerId?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentStatus: string;
}

export interface CreateSessionResponse {
  orderGroupId: string;
  orders: CheckoutOrderDto[];
  expiresAt: string;
}

export const checkoutService = {
  createSession: async (payload: CreateSessionRequest) => {
    const { data } = await apiClient.post<CreateSessionResponse>(`/checkout/create-session`, payload);
    return data;
  },
};


