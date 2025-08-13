import apiClient from './baseApi';

export interface OrderModel {
  orderId: number;
  userId: number;
  userName?: string;
  shippingAddress: string;
  status: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  totalPrice: number;
  orderDate: string;
  sellerName?: string;
  sellerType?: string;
  sellerAvatarUrl?: string;
}

export const ordersService = {
  getAll: async () => {
    const { data } = await apiClient.get(`/order/getall`);
    return (data?.result || data) as OrderModel[];
  },
  getById: async (orderId: number) => {
    const { data } = await apiClient.get(`/order/${orderId}`);
    // backend wraps in ApiResult; baseApi returns raw data, but here assume direct passthrough
    return (data?.result || data) as { result?: { orderId: number; status: string; paymentStatus?: string } };
  },
  getDetailsByOrderId: async (orderId: number) => {
    const { data } = await apiClient.get(`/orderdetail/getall`);
    const rows = (data?.result || data) as any[];
    return rows.filter(r => r.orderId === orderId);
  },
};


