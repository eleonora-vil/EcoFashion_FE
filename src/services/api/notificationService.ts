import apiClient, { handleApiResponse } from './baseApi';

export interface NotificationItem {
  notificationId: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string | null;
  relatedType?: string | null;
}

class NotificationService {
  private readonly API_BASE = 'Notification';

  async getUserNotifications(userId: number, page = 1, pageSize = 10): Promise<NotificationItem[]> {
    const response = await apiClient.get<any>(`${this.API_BASE}/user/${userId}?page=${page}&pageSize=${pageSize}`);
    return handleApiResponse<NotificationItem[]>(response);
  }

  async getUnreadCount(userId: number): Promise<number> {
    const response = await apiClient.get<any>(`${this.API_BASE}/unread-count/${userId}`);
    return handleApiResponse<number>(response);
  }

  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    const response = await apiClient.post<any>(`${this.API_BASE}/mark-as-read/${notificationId}?userId=${userId}`);
    return !!handleApiResponse<boolean>(response);
  }

  async markAllAsRead(userId: number): Promise<boolean> {
    const response = await apiClient.post<any>(`${this.API_BASE}/mark-all-as-read/${userId}`);
    return !!handleApiResponse<boolean>(response);
  }
}

export const notificationService = new NotificationService();
export default notificationService;


