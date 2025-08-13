import React from 'react';
import { useQuery } from '@tanstack/react-query';
import materialService from '../../services/api/materialService';
import type { MaterialDetailDto } from '../../schemas/materialSchema';
import MaterialDetailModal from '../../components/admin/MaterialDetailModal';

const MaterialsAll: React.FC = () => {
  const { data: materials = [], isLoading, error } = useQuery<MaterialDetailDto[]>({
    queryKey: ['adminMaterials', 'All'],
    queryFn: () => materialService.getAllMaterialsAdmin(),
  });

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailId, setDetailId] = React.useState<number | null>(null);

  return (
    <>
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Tất Cả Vật Liệu</h1>
            <p className="dashboard-subtitle">Danh sách vật liệu hiển thị công khai</p>
          </div>

          <div className="dashboard-card">
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Lỗi tải dữ liệu</div>
              ) : materials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có vật liệu</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {materials.map((m) => (
                    <div key={m.materialId} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{m.name}</h3>
                          <p className="text-sm text-gray-500">{m.materialTypeName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${m.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {m.isAvailable ? 'Active' : 'Inactive'}
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

export default MaterialsAll;


