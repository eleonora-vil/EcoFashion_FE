import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatViDateTime, formatViDate } from '../../utils/date';
import inventoryAnalyticsService, { InventorySummaryDto, LowStockItemDto, SupplierReceiptPointDto } from '../../services/api/inventoryAnalyticsService';
import materialInventoryService from '../../services/api/materialInventoryService';
import type { MaterialStockTransactionDto } from '../../schemas/inventorySchema';
import { BsArrowUpRight, BsArrowDownRight } from 'react-icons/bs';

const formatCurrency = (n: number) => (n * 1000).toLocaleString('vi-VN') + 'đ';

const InventoryReport: React.FC = () => {
  const [from, setFrom] = React.useState<string>(() => new Date(Date.now() - 7 * 86400000).toISOString());
  const [to, setTo] = React.useState<string>(() => new Date().toISOString());

  const { data: summary } = useQuery<InventorySummaryDto>({
    queryKey: ['invSummary', from, to],
    queryFn: () => inventoryAnalyticsService.getSummary({ from, to }),
  });

  const { data: receiptsBySupplier = [] } = useQuery<SupplierReceiptPointDto[]>({
    queryKey: ['invReceiptsBySupplier', from, to],
    queryFn: () => inventoryAnalyticsService.getReceiptsBySupplier({ from, to }),
  });

  const { data: lowStock = [] } = useQuery<LowStockItemDto[]>({
    queryKey: ['invLowStock'],
    queryFn: () => inventoryAnalyticsService.getLowStock({ limit: 20 }),
  });

  const { data: supplierReceipts = [] } = useQuery<MaterialStockTransactionDto[]>({
    queryKey: ['invSupplierReceipts', from, to],
    queryFn: () => materialInventoryService.getTransactions({ type: 'SupplierReceipt', from, to } as any),
  });

  const [detailTx, setDetailTx] = React.useState<MaterialStockTransactionDto | null>(null);

  const DeltaCell: React.FC<{ delta: number }> = ({ delta }) => {
    if (delta > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-green-600 text-[13px]">
          <BsArrowUpRight className="w-3 h-3" /> +{delta}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-red-600 text-[13px]">
          <BsArrowDownRight className="w-3 h-3" /> {delta}
        </span>
      );
    }
    return <span className="text-gray-500 text-[13px]">0</span>;
  };

  const downloadReceiptsCsv = () => {
    const rows = receiptsBySupplier.map(r => [
      formatViDate(r.date),
      r.supplierName || '',
      r.quantity,
    ]);
    const header = ['Ngày', 'Nhà cung cấp', 'Nhập'];
    const csv = [header, ...rows]
      .map(cols => cols.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts_${new Date(from).toISOString().slice(0,10)}_${new Date(to).toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Báo Cáo Kho Hàng</h1>
            <p className="dashboard-subtitle">Tổng quan tồn kho và biến động gần đây</p>
            <div className="mt-3 flex gap-3 items-center">
              <div>
                <label className="text-xs text-gray-500">Từ ngày</label>
                <input type="datetime-local" className="form-input" value={from.slice(0,16)} onChange={(e)=>setFrom(new Date(e.target.value).toISOString())} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Đến ngày</label>
                <input type="datetime-local" className="form-input" value={to.slice(0,16)} onChange={(e)=>setTo(new Date(e.target.value).toISOString())} />
              </div>
            </div>
          </div>

          {/* KPI */}
          <div className="grid-stats mb-8">
            <div className="stats-card">
              <p className="stats-label">Số vật liệu</p>
              <p className="stats-value">{summary?.totalDistinctMaterials ?? '—'}</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">Tồn kho hiện tại (tổng theo mét vải) </p>
              <p className="stats-value">{summary?.totalOnHand ?? '—'}</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">Giá trị tồn (ước tính theo VNĐ)</p>
              <p className="stats-value">{summary ? formatCurrency(summary.totalInventoryValue) : '—'}</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">Dưới ngưỡng</p>
              <p className="stats-value">{summary?.lowStockCount ?? '—'}</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">Hết hàng</p>
              <p className="stats-value">{summary?.stockoutCount ?? '—'}</p>
            </div>
          </div>

          {/* Receipts by supplier */}
          <div className="chart-container mb-8">
            <div className="flex items-center justify-between">
              <h3 className="chart-title">Nhập kho theo ngày (theo nhà cung cấp)</h3>
              <button className="btn-secondary" onClick={downloadReceiptsCsv}>Xuất CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Ngày</th>
                    <th className="p-2">Nhà cung cấp</th>
                    <th className="p-2">Nhập</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptsBySupplier.map(r => (
                    <tr key={`${r.date}-${r.supplierName || 'NA'}`} className="border-t">
                      <td className="p-2">{formatViDate(r.date)}</td>
                      <td className="p-2">{r.supplierName || '—'}</td>
                      <td className="p-2 text-green-700">+{r.quantity}</td>
                    </tr>
                  ))}
                  {receiptsBySupplier.length === 0 && (
                    <tr><td className="p-2 text-gray-500" colSpan={3}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lịch sử giao dịch - dùng ngay với SupplierReceipt - NCC nhập kho */}
          <div className="dashboard-card mb-8">
            <div className="card-header">
              <h3 className="card-title">Lịch Sử Giao Dịch</h3>
              <p className="card-subtitle">Các thay đổi gần đây (NCC nhập kho)</p>
            </div>
            <div className="card-body overflow-x-auto">
              {supplierReceipts.length === 0 ? (
                <div className="text-gray-500">Không có giao dịch</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Thời gian</th>
                      <th className="p-2">Người Nhập</th>
                      <th className="p-2">Loại</th>
                      <th className="p-2">Chênh lệch</th>
                      <th className="p-2">Trước → Sau</th>
                      <th className="p-2">Tham chiếu</th>
                      <th className="p-2">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierReceipts.map(t => (
                      <tr key={t.transactionId} className="border-t">
                        <td className="p-2">{formatViDateTime(t.createdAt as any)}</td>
                        <td className="p-2">{t.supplierName || '—'}</td>
                        <td className="p-2">NCC nhập kho</td>
                        <td className="p-2"><DeltaCell delta={t.quantityChange as number} /></td>
                        <td className="p-2">{t.beforeQty} → {t.afterQty}</td>
                        <td className="p-2">{t.referenceType && t.referenceId ? `${t.referenceType} #${t.referenceId}` : '—'}</td>
                        <td className="p-2">
                          <button
                            className="p-1 text-gray-600 hover:text-gray-900"
                            onClick={() => setDetailTx(t)}
                            aria-label="Xem chi tiết"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M12 4.5c-4.79 0-8.88 2.96-10.5 7.5 1.62 4.54 5.71 7.5 10.5 7.5s8.88-2.96 10.5-7.5C20.88 7.46 16.79 4.5 12 4.5Zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {detailTx && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setDetailTx(null)} />
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold">Chi tiết giao dịch #{detailTx.transactionId}</h3>
                  <button className="p-2 text-gray-500 hover:text-gray-700" onClick={() => setDetailTx(null)} aria-label="Đóng">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Thời gian</p>
                      <p className="text-sm">{formatViDateTime(detailTx.createdAt as any)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kho</p>
                      <p className="text-sm">{(detailTx as any).warehouseName || detailTx.warehouseId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loại kho</p>
                      <p className="text-sm">{(detailTx as any).warehouseType || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loại hàng</p>
                      <p className="text-sm">Nguyên liệu</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tên mặt hàng</p>
                      <p className="text-sm">{(detailTx as any).materialName || detailTx.materialId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loại giao dịch</p>
                      <p className="text-sm">NCC nhập kho</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Thay đổi</p>
                      <p className="text-sm"><DeltaCell delta={detailTx.quantityChange as number} /></p>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
                    <p className="text-sm font-medium mb-2">Thay đổi tồn kho</p>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold">{detailTx.beforeQty}</div>
                        <div className="text-xs text-gray-500">Trước</div>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-center">
                        <div className="text-xl font-semibold text-green-600">{detailTx.afterQty}</div>
                        <div className="text-xs text-gray-500">Sau</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
                    <p className="text-sm font-medium mb-2">Ảnh minh họa</p>
                    {((detailTx as any).imageUrl) ? (
                      <img
                        src={(detailTx as any).imageUrl}
                        alt={(detailTx as any).materialName || ''}
                        className="w-36 h-36 object-cover rounded-md border border-gray-200 dark:border-gray-800"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Không có ảnh</p>
                    )}
                  </div>

                  <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
                    <p className="text-sm font-medium mb-1">Tham chiếu</p>
                    <p className="text-sm text-gray-700">{detailTx.referenceType && detailTx.referenceId ? `${detailTx.referenceType} #${detailTx.referenceId}` : 'NCC nhập kho'}</p>
                  </div>

                  <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4">
                    <p className="text-sm font-medium mb-1">Ghi chú</p>
                    <p className="text-sm text-gray-700">{detailTx.note || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Low stock */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Vật liệu dưới ngưỡng</h3>
              <p className="card-subtitle">Top 20 mục cần chú ý</p>
            </div>
            <div className="card-body overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Vật liệu</th>
                    <th className="p-2">Kho</th>
                    <th className="p-2">Tồn</th>
                    <th className="p-2">Ngưỡng</th>
                    <th className="p-2">Chênh lệch</th>
                    <th className="p-2">Giá trị ước tính</th>
                    <th className="p-2">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map(item => (
                    <tr key={`${item.materialId}-${item.warehouseId}`} className="border-t">
                      <td className="p-2">{item.materialName || `#${item.materialId}`}</td>
                      <td className="p-2">{item.warehouseName || item.warehouseId}</td>
                      <td className="p-2">{item.quantityOnHand}</td>
                      <td className="p-2">{item.minThreshold}</td>
                      <td className="p-2">{item.difference}</td>
                      <td className="p-2">{formatCurrency(item.estimatedValue)}</td>
                      <td className="p-2">{new Date(item.lastUpdated).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                  {lowStock.length === 0 && (
                    <tr><td className="p-2 text-gray-500" colSpan={7}>Không có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;


