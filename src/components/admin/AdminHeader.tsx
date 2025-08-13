import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Avatar from '../common/Avatar';
import notificationService, { NotificationItem } from '../../services/api/notificationService';
import { formatViDateTime } from '../../utils/date';
import { useQuery } from '@tanstack/react-query';
import logo2 from '../../assets/pictures/homepage/logo2.png';

const AdminHeader: React.FC = () => {
  const { toggleAdminMobileSidebar } = useUIStore();
  const { 
    user, 
    getInitials, 
    getAvatarUrl, 
    getDisplayName,
    logout
  } = useAuthStore();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notifications = [], refetch: refetchNotes } = useQuery<NotificationItem[]>({
    queryKey: ['adminNotifications', user?.userId],
    enabled: !!user,
    queryFn: () => notificationService.getUserNotifications(user!.userId, 1, 10),
    retry: 2,
    refetchInterval: isNotificationOpen ? 10000 : false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ['adminUnreadCount', user?.userId],
    enabled: !!user,
    queryFn: () => notificationService.getUnreadCount(user!.userId),
    retry: 2,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm dark:bg-gray-900 lg:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleAdminMobileSidebar}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-h-4 min-w-4 px-1 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">Không có thông báo</div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.notificationId}
                      className="w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={async () => {
                        if (!user) return;
                        try { await notificationService.markAsRead(n.notificationId, user.userId); } catch {}
                        setIsNotificationOpen(false);
                        // Route based on related type
                        const type = (n.relatedType || '').toLowerCase();
                        const id = n.relatedId ? parseInt(n.relatedId) : NaN;
                        if (type === 'material' && !Number.isNaN(id)) {
                          navigate(`/admin/dashboard/materials/pending?focusId=${id}`);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${n.type === 'success' ? 'bg-green-500' : n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-brand-500'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{formatViDateTime(n.createdAt as any)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <button
                  className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  onClick={async () => {
                    if (!user) return;
                    await notificationService.markAllAsRead(user.userId);
                  }}
                >
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Avatar 
              src={getAvatarUrl() || logo2}
              alt={getDisplayName()}
              fallbackText={getInitials('A')}
              size="md"
            />
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'admin@ecofashion.com'}
                </p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { navigate('/'); setIsUserMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Trang Chủ
                </button>
                <button 
                  onClick={() => { navigate('/admin/profile'); setIsUserMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Trang Cá Nhân
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button 
                  onClick={async () => { await logout(); setIsUserMenuOpen(false); navigate('/'); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  Đăng Xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 