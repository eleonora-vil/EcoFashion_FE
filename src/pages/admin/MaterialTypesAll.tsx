import React from 'react';
import { useQuery } from '@tanstack/react-query';
import materialService from '../../services/api/materialService';
import type { MaterialTypeModel } from '../../schemas/materialSchema';
import MaterialTypeDetailModal from '../../components/admin/MaterialTypeDetailModal';

const MaterialTypesAll: React.FC = () => {
  const { data: types = [], isLoading, error } = useQuery<MaterialTypeModel[]>({
    queryKey: ['adminMaterialTypes', 'All'],
    queryFn: () => materialService.getAllMaterialTypes(),
  });

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailType, setDetailType] = React.useState<MaterialTypeModel | null>(null);

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Tất Cả Loại Vật Liệu</h1>
            <p className="dashboard-subtitle">Danh sách loại vật liệu từ hệ thống</p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm leading-relaxed">
              <p className="text-blue-800">
                <span className="font-medium">Giải thích nhanh:</span>
                <br />- <span className="font-medium">Hữu cơ</span>: Thuộc tính phân loại ở cấp loại vật liệu, cho biết loại này thuộc nhóm vật liệu <em>organic</em> (ví dụ nguồn sợi/quy trình hữu cơ). Không ám chỉ tất cả vật liệu con đều có chứng chỉ hữu cơ.
                <br />- <span className="font-medium">Tái chế</span>: Thuộc tính phân loại ở cấp loại vật liệu, cho biết loại này thuộc nhóm vật liệu <em>recycled</em> (ví dụ Recycled Polyester, Recycled Cotton). Không ám chỉ tỷ lệ tái chế cụ thể của từng vật liệu.
                <br />- <span className="font-medium">Hữu cơ: Không ; Tái chế: Không</span>: Đây là những loại vật liệu “nguyên sinh/không tái chế” và “không thuộc nhóm organic” theo phân loại cấp loại.
                <br />- <span className="font-medium">Ví dụ </span>: Regenerated cellulose (Bamboo Viscose, Lyocell/Tencel) – sợi tái sinh từ cellulose, không có recycled content và không mặc định là organic.
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Lỗi tải dữ liệu</div>
              ) : types.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có loại vật liệu</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {types.map((t) => (
                    <div key={t.typeId} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{t.typeName}</h3>
                          <p className="text-sm text-gray-500">{t.category || '—'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {t.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            className="p-1 text-gray-500 hover:text-brand-600"
                            title="Xem chi tiết"
                            onClick={() => { setDetailType(t); setDetailOpen(true); }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {t.description && (
                        <p className="mt-2 text-sm text-gray-600">{t.description}</p>
                      )}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-gray-50 rounded">
                          Hữu cơ: <span className="font-medium">{t.isOrganic ? 'Có' : 'Không'}</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          Tái chế: <span className="font-medium">{t.isRecycled ? 'Có' : 'Không'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MaterialTypeDetailModal open={detailOpen} materialType={detailType} onClose={() => setDetailOpen(false)} />
    </div>
  );
};

export default MaterialTypesAll;


