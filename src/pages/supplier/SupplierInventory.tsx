import React from 'react';
import { useSupplierStocks, useMaterialTransactions, useReceiveMaterial } from '../../hooks/useSupplierInventory';
import { formatViDateTime } from '../../utils/date';
import { PlusIcon } from '../../assets/icons/index.tsx';

const SupplierInventory: React.FC = () => {
  const { data: stocks = [], isLoading } = useSupplierStocks();
  const [activeMaterialId, setActiveMaterialId] = React.useState<number | null>(null);
  const { data: transactions = [] } = useMaterialTransactions(activeMaterialId ? { materialId: activeMaterialId } : undefined);
  const receive = useReceiveMaterial();

  const [qty, setQty] = React.useState<string>('');
  const [warehouseId, setWarehouseId] = React.useState<number | null>(null);
  const [openId, setOpenId] = React.useState<number | null>(null);

  const openModal = (materialId: number, warehouse: number) => {
    setOpenId(materialId);
    setActiveMaterialId(materialId);
    setWarehouseId(warehouse);
    setQty('');
  };

  const submitReceive = async () => {
    if (!openId || !warehouseId) return;
    const quantity = parseFloat(qty);
    if (!quantity || quantity <= 0) return;
    await receive.mutateAsync({ materialId: openId, warehouseId, quantity, unit: 'm' });
    setOpenId(null);
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Quản Lý Kho Vật Liệu</h1>
            <p className="dashboard-subtitle">Xem tồn và nhập kho nhanh</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="text-gray-500">Đang tải...</div>
            ) : stocks.length === 0 ? (
              <div className="text-gray-500">Chưa có tồn kho</div>
            ) : (
              stocks.map((s) => (
                <div key={`${s.materialId}-${s.warehouseId}`} className="border rounded-xl bg-white shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.materialName || `Material #${s.materialId}`}</h3>
                      <p className="text-xs text-gray-500">Kho: {s.warehouseName || s.warehouseId}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Đủ hàng</span>
                  </div>
                  {s.imageUrl && (
                    <img src={s.imageUrl} alt={s.materialName || ''} className="w-full h-36 object-cover rounded-md mt-3" />
                  )}
                  <div className="mt-3 text-sm">
                    <p className="text-gray-600">Tồn kho: <span className="text-gray-900 font-medium">{s.quantityOnHand} {s.unit || 'mét'}</span></p>
                    <p className="text-gray-600">Tối thiểu: <span className="text-gray-900 font-medium">{s.minThreshold} {s.unit || 'mét'}</span></p>
                    <p className="text-gray-600">Danh mục hiện có: <span className="text-gray-900 font-medium">{s.quantityAvailable} {s.unit || 'mét'}</span></p>
                    <p className="text-gray-600">Đơn giá: <span className="text-gray-900 font-medium">{(s.pricePerUnit * 1000).toLocaleString()}đ/m</span></p>
                  </div>
                  <div className="mt-3">
                    <button className="w-full h-10 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                      onClick={() => openModal(s.materialId, s.warehouseId)}>
                      <PlusIcon className="w-4 h-4" />
                      Nhập kho
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Transactions list (simple) */}
          <div className="dashboard-card mt-8">
            <div className="card-header">
              <h3 className="card-title">Lịch Sử Giao Dịch</h3>
              <p className="card-subtitle">Các thay đổi gần đây</p>
            </div>
            <div className="card-body overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="text-gray-500">Chưa có giao dịch</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="p-2">Thời gian</th>
                      <th className="p-2">Loại</th>
                      <th className="p-2">Chênh lệch</th>
                      <th className="p-2">Trước → Sau</th>
                      <th className="p-2">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.transactionId} className="border-t">
                        <td className="p-2">{formatViDateTime(t.createdAt as any)}</td>
                        <td className="p-2">{t.transactionType}</td>
                        <td className="p-2">{t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}</td>
                        <td className="p-2">{t.beforeQty} → {t.afterQty}</td>
                        <td className="p-2">{t.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Simple receive modal */}
          {openId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setOpenId(null)} />
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Nhập kho</h3>
                  <p className="text-sm text-gray-500">Material #{openId}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Số lượng *</label>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full border rounded p-2" placeholder="0" min={0} step={0.01} />
                  </div>
                  <div className="text-xs text-gray-500">Kho: {warehouseId}</div>
                </div>
                <div className="flex items-center justify-end gap-2 p-4 border-t">
                  <button className="btn-secondary" onClick={() => setOpenId(null)}>Hủy</button>
                  <button className="btn-primary" onClick={submitReceive} disabled={receive.isPending}>Nhập kho</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SupplierInventory;


