import React from 'react';
import { useQuery } from '@tanstack/react-query';
import materialService from '../../services/api/materialService';
import type { MaterialDetailDto } from '../../schemas/materialSchema';

const MaterialsApproved: React.FC = () => {
  const { data: materials = [], isLoading, error } = useQuery<MaterialDetailDto[]>({
    queryKey: ['adminMaterials', 'Approved'],
    queryFn: () => materialService.getAllMaterials(), // placeholder for approved listing
  });

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Vật Liệu - Đã Phê Duyệt</h1>
            <p className="dashboard-subtitle">Danh sách vật liệu đã được phê duyệt</p>
          </div>

          <div className="dashboard-card">
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Lỗi tải dữ liệu</div>
              ) : materials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có vật liệu đã phê duyệt</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {materials.map((m) => (
                    <div key={m.materialId} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{m.name}</h3>
                          <p className="text-sm text-gray-500">{m.materialTypeName}</p>
                          <p className="text-xs text-gray-400 mt-1">Supplier: {m.supplierName || m.supplierId}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Approved</span>
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
  );
};

export default MaterialsApproved;


