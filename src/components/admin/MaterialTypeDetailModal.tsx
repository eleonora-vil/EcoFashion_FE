import React from 'react';
import type { MaterialTypeModel, MaterialTypeBenchmarkModel } from '../../schemas/materialSchema';
import materialService from '../../services/api/materialService';

type Props = {
  open: boolean;
  materialType: MaterialTypeModel | null;
  onClose: () => void;
};

const Row: React.FC<{ label: React.ReactNode; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-1">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm text-gray-900 dark:text-white text-right break-words max-w-[70%]">{value ?? '—'}</span>
  </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group inline-flex items-center">
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
    <div className="pointer-events-none absolute z-50 hidden group-hover:block left-1/2 -translate-x-1/2 mt-2 w-[18rem] max-w-sm rounded-md bg-gray-900 text-white text-base leading-snug p-3 shadow-xl">
      {text}
    </div>
  </span>
);

const MaterialTypeDetailModal: React.FC<Props> = ({ open, materialType, onClose }) => {
  const [benchmarks, setBenchmarks] = React.useState<MaterialTypeBenchmarkModel[]>([]);
  const [bmLoading, setBmLoading] = React.useState(false);
  const [bmError, setBmError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      if (!open || !materialType) return;
      try {
        setBmLoading(true);
        setBmError(null);
        const data = await materialService.getBenchmarksByMaterialType(materialType.typeId);
        setBenchmarks(data);
      } catch (e: any) {
        setBmError('Không thể tải benchmarks');
      } finally {
        setBmLoading(false);
      }
    };
    load();
  }, [open, materialType?.typeId]);

  if (!open || !materialType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chi Tiết Loại Vật Liệu</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{materialType.typeId} • {materialType.category || 'Không phân loại'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Đóng">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{materialType.typeName}</h2>
            {materialType.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{materialType.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <Row label={"Danh mục"} value={materialType.category || '—'} />
              <Row
                label={
                  <span className="inline-flex items-center gap-1">
                    Hữu cơ
                    <InfoTooltip text="Thuộc tính phân loại ở cấp loại vật liệu; cho biết loại này thuộc nhóm vật liệu organic (ví dụ nguồn sợi/quy trình hữu cơ)." />
                  </span>
                }
                value={materialType.isOrganic ? 'Có' : 'Không'}
              />
              <Row
                label={
                  <span className="inline-flex items-center gap-1">
                    Tái chế
                    <InfoTooltip text="Thuộc tính phân loại ở cấp loại vật liệu; cho biết loại này thuộc nhóm vật liệu tái chế (ví dụ Recycled Polyester)." />
                  </span>
                }
                value={materialType.isRecycled ? 'Có' : 'Không'}
              />
              <Row label={"Thứ tự hiển thị"} value={materialType.displayOrder} />
              <Row label={"Trạng thái"} value={materialType.isActive ? 'Active' : 'Inactive'} />
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Ghi chú bền vững</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 min-h-[60px]">{materialType.sustainabilityNotes || '—'}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Benchmarks (theo loại vật liệu)</p>
            {bmLoading ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : bmError ? (
              <p className="text-sm text-red-500">{bmError}</p>
            ) : benchmarks.length === 0 ? (
              <p className="text-sm text-gray-500">Không có benchmark</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-2">Tiêu chí</th>
                      <th className="text-left p-2">Mô tả</th>
                      <th className="text-left p-2">Giá trị chuẩn</th>
                      <th className="text-left p-2">Đơn vị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarks.map((b) => (
                      <tr key={b.benchmarkId} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="p-2">{b.sustainabilityCriteria?.name}</td>
                        <td className="p-2">{b.sustainabilityCriteria?.description}</td>
                        <td className="p-2">{b.value}</td>
                        <td className="p-2">{b.sustainabilityCriteria?.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default MaterialTypeDetailModal;


