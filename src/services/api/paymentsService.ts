import apiClient from './baseApi';

export interface CreateVnpayRequest {
  orderId: number;
  fullName?: string;
  description?: string;
  amount: number;
  bankCode?: string;
  //-----
  createdDate: string; // ISO string preferred, backend will format
}

export interface CreateVnpayResponse {
  redirectUrl: string;
}

export const paymentsService = {
  createVnpay: async (payload: CreateVnpayRequest) => {
    const { data } = await apiClient.post<CreateVnpayResponse>(`/payments/create-vnpay`, payload);
    return data;
  },
};


