import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import materialService from '../../services/api/materialService';
import notificationService, { type NotificationItem } from '../../services/api/notificationService';
import { useAuthStore } from '../../store/authStore';
import type { MaterialDetailResponse } from '../../schemas/materialSchema';
import MaterialDetailModal from '../../components/admin/MaterialDetailModal';

const MaterialsPending: React.FC = () => {
  const queryClient = useQueryClient();

  const userId = useAuthStore((s) => s.user?.userId);

  const { data: materials = [], isLoading, error } = useQuery<MaterialDetailResponse[]>({
    queryKey: ['adminMaterials', 'Pending', userId],
    enabled: !!userId,
    queryFn: async () => {
      // Fetch recent notifications for admin and build pending list from related material IDs
      const notes = await notificationService.getUserNotifications(userId!, 1, 20);
      const materialNoteIds = notes
        .filter((n: NotificationItem) => (n.relatedType || '').toLowerCase() === 'material' && n.relatedId)
        .map((n) => Number(n.relatedId));

      // De-duplicate IDs
      const uniqueIds = Array.from(new Set(materialNoteIds)).filter((id) => !Number.isNaN(id));
      if (uniqueIds.length === 0) return [];

      const details = await Promise.all(uniqueIds.map((id) => materialService.getMaterialDetail(id)));
      // Only show truly pending items
      return details.filter((d) => (d.approvalStatus || '').toLowerCase() === 'pending');
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => materialService.approveMaterial(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMaterials'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => materialService.rejectMaterial(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMaterials'] });
    },
  });

  const [notes, setNotes] = React.useState<Record<number, string>>({});
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailId, setDetailId] = React.useState<number | null>(null);

  // Optional: focus a specific material card via query param focusId
  const focusId = new URLSearchParams(window.location.search).get('focusId');

  return (
    <>
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Vật Liệu - Chờ Phê Duyệt</h1>
            <p className="dashboard-subtitle">Duyệt vật liệu do nhà cung cấp gửi lên</p>
          </div>

          <div className="dashboard-card">
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Lỗi tải dữ liệu</div>
              ) : materials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có vật liệu nào</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {materials.map((m) => (
                    <div
                      key={m.materialId}
                      className={`p-4 border rounded-lg bg-white shadow-sm ${String(m.materialId) === focusId ? 'ring-2 ring-brand-500' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{m.name}</h3>
                          <p className="text-sm text-gray-500">{m.materialTypeName}</p>
                          <p className="text-xs text-gray-400 mt-1">Supplier: {m.supplier?.supplierName || m.supplier?.supplierId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${m.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' : m.approvalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {m.approvalStatus || 'N/A'}
                          </span>
                          <button
                            className="p-1 text-gray-500 hover:text-brand-600"
                            title="Xem chi tiết"
                            onClick={() => { setDetailId(m.materialId); setDetailOpen(true); }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {m.imageUrls && m.imageUrls.length > 0 && (
                        <img src={m.imageUrls[0]} alt={m.name || ''} className="w-full h-40 object-cover rounded mt-3" />
                      )}

                      <div className="mt-4">
                        <textarea
                          placeholder="Ghi chú cho admin (tùy chọn)"
                          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:ring-brand-200"
                          value={notes[m.materialId] || ''}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [m.materialId]: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          className="btn-secondary"
                          onClick={() => rejectMutation.mutate({ id: m.materialId, note: notes[m.materialId] })}
                          disabled={rejectMutation.isPending}
                        >
                          Từ chối
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => approveMutation.mutate({ id: m.materialId, note: notes[m.materialId] })}
                          disabled={approveMutation.isPending}
                        >
                          Duyệt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <MaterialDetailModal open={detailOpen} materialId={detailId} onClose={() => setDetailOpen(false)} />
    </>
  );
};

export default MaterialsPending;


