import React from 'react';
import { useQuery } from '@tanstack/react-query';
import materialService from '../../services/api/materialService';
import type { MaterialDetailResponse } from '../../schemas/materialSchema';

type Props = {
  open: boolean;
  materialId: number | null;
  onClose: () => void;
};

const Badge: React.FC<{ label: string; colorClass: string }> = ({ label, colorClass }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>{label}</span>
);

const MaterialDetailModal: React.FC<Props> = ({ open, materialId, onClose }) => {
  const { data, isLoading, error } = useQuery<MaterialDetailResponse>({
    queryKey: ['materialDetail', materialId],
    enabled: open && !!materialId,
    queryFn: () => materialService.getMaterialDetail(materialId as number),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
  });

  if (!open) return null;

  const status = data?.approvalStatus || 'N/A';
  const statusColor = status === 'Approved' ? 'bg-green-100 text-green-700' : status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Vật Liệu</h3>
            {data && (
              <p className="text-sm text-gray-500 dark:text-gray-400">#{data.materialId} • {data.materialTypeName}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Đóng">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Đang tải chi tiết...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">Lỗi tải chi tiết vật liệu</div>
          ) : data ? (
            <div className="space-y-6">
              {/* Top section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  {data.imageUrls && data.imageUrls.length > 0 ? (
                    <img src={data.imageUrls[0]} alt={data.name || ''} className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-800" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {(data.imageUrls || []).slice(1, 6).map((url, idx) => (
                      <img key={idx} src={url} alt={`thumb-${idx}`} className="w-16 h-16 object-cover rounded border" />
                    ))}
                  </div>
                </div>
                <div className="md:w-2/3 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{data.name}</h2>
                    <Badge label={status} colorClass={statusColor} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Nhà cung cấp:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{data.supplier?.supplierName || data.supplier?.supplierId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Giá:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{(data.pricePerUnit * 1000).toLocaleString()}đ/m</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Số lượng:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{data.quantityAvailable}m</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tái chế:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{data.recycledPercentage ?? 0}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quốc gia:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{data.productionCountry || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Khu vực:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{data.productionRegion || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sustainability */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500">Sustainability Score</p>
                  <p className="text-2xl font-bold" style={{ color: data.sustainabilityColor || 'inherit' }}>{data.sustainabilityScore ?? 0}</p>
                  <p className="text-sm text-gray-600">{data.sustainabilityLevel}</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500">Vận chuyển</p>
                  <p className="text-sm text-gray-900 dark:text-white">{data.transportDistance ?? 0} km • {data.transportMethod || '—'}</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500">Chứng chỉ</p>
                  <p className="text-sm text-gray-900 dark:text-white break-words">{data.certificationDetails || '—'}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">Carbon Footprint</p>
                  <p className="text-sm text-gray-900 dark:text-white">{data.carbonFootprint ?? 0} {data.carbonFootprintUnit || ''}</p>
                </div>
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">Water Usage</p>
                  <p className="text-sm text-gray-900 dark:text-white">{data.waterUsage ?? 0} {data.waterUsageUnit || ''}</p>
                </div>
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500">Waste Diverted</p>
                  <p className="text-sm text-gray-900 dark:text-white">{data.wasteDiverted ?? 0} {data.wasteDivertedUnit || ''}</p>
                </div>
              </div>             

              {/* Benchmark comparison & improvements */}
              {data.benchmarks && data.benchmarks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">So sánh với chuẩn & mức cải thiện</h4>
                    <p className="text-xs text-gray-500">
                      Tổng điểm: <span className="font-semibold text-gray-900 dark:text-white">{(data.sustainabilityScore ?? 0).toFixed(0)}%</span>
                    </p>
                  </div>
                  <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="text-left p-2">Tiêu chí</th>
                          <th className="text-left p-2">Chuẩn</th>
                          <th className="text-left p-2">Thực tế</th>
                          <th className="text-left p-2">Đơn vị</th>
                          <th className="text-left p-2">Cải thiện</th>
                          <th className="text-left p-2">Đánh giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.benchmarks.map((b, idx) => (
                          <tr key={idx} className="border-t border-gray-100 dark:border-gray-800">
                            <td className="p-2 whitespace-nowrap">{b.sustainabilityCriteria?.name}</td>
                            <td className="p-2">{typeof b.value === 'number' ? b.value : Number(b.value)}{b.sustainabilityCriteria?.unit ? ` ${b.sustainabilityCriteria?.unit}` : ''}</td>
                            <td className="p-2">{b.actualValue ?? '—'}{b.sustainabilityCriteria?.unit ? ` ${b.sustainabilityCriteria?.unit}` : ''}</td>
                            <td className="p-2">{b.sustainabilityCriteria?.unit || '—'}</td>
                            <td className="p-2">
                              {typeof b.improvementPercentage === 'number' ? (
                                <span className={
                                  b.improvementPercentage > 0
                                    ? 'text-green-600'
                                    : b.improvementPercentage < 0
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }>
                                  {b.improvementPercentage.toFixed(1)}%
                                </span>
                              ) : '—'}
                            </td>
                            <td className="p-2">
                              <span className={
                                b.improvementColor === 'success'
                                  ? 'text-green-600'
                                  : b.improvementColor === 'error'
                                  ? 'text-red-600'
                                  : 'text-amber-600'
                              }>
                                {b.improvementStatus || '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Admin note */}
              {typeof data.adminNote !== 'undefined' && (
                <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500">Ghi chú của quản trị viên</p>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{data.adminNote || '—'}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onClose} className="btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailModal;


