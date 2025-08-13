import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersService } from '../../services/api/ordersService';
import { formatViDateTime } from '../../utils/date';

export default function OrdersDetails() {
  const { orderId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        if (!orderId) return;
        const res = await ordersService.getById(Number(orderId));
        setData((res as any)?.result || res);
        const lines = await ordersService.getDetailsByOrderId(Number(orderId));
        setDetails(lines);
      } catch (e: any) {
        setError(e?.message || 'Không tải được chi tiết đơn');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  if (loading) return <div className="max-w-[1120px] mx-auto p-6">Đang tải chi tiết đơn...</div>;
  if (error) return <div className="max-w-[1120px] mx-auto p-6 text-red-600">{error}</div>;
  if (!data) return null;
  const subtotal = details.reduce((s, d) => s + Number(d.unitPrice || 0) * Number(d.quantity || 0), 0);
  const shipping = Number((data as any).shippingFee ?? 0);
  const discount = Number((data as any).discount ?? 0);
  const total = Number((data as any).totalPrice ?? (subtotal + shipping - discount));

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Đơn #{data.orderId}</h1>
        <Link to="/orders" className="text-green-700 hover:underline">Danh sách đơn</Link>
      </div>
      <div className="bg-white border rounded-md p-4 grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500">Trạng thái</div>
          <div className="font-medium">{String(data.status)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Thanh toán</div>
          <div className="font-medium">{String(data.paymentStatus || 'Pending')}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Tổng tiền</div>
          <div className="font-semibold text-green-700">{Number(data.totalPrice || 0).toLocaleString('vi-VN')} ₫</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Ngày đặt</div>
          <div className="font-medium">{(data as any).orderDate ? formatViDateTime((data as any).orderDate) : '-'}</div>
        </div>
      </div>

      <div className="bg-white border rounded-md">
        <div className="px-4 py-3 border-b font-medium">Sản phẩm</div>
        <div className="divide-y">
          {details.map((d) => (
            <div key={d.orderDetailId} className="px-4 py-3 grid grid-cols-12 items-center gap-3">
              <div className="col-span-2">
                {d.imageUrl ? (
                  <img src={d.imageUrl} alt={d.itemName} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded" />
                )}
              </div>
              <div className="col-span-4">
                <div className="font-medium">{d.itemName}</div>
                <div className="text-sm text-gray-500">{d.type} • NCC/NTK: {d.providerName}</div>
              </div>
              <div className="col-span-2 text-gray-700">{Number(d.unitPrice || 0).toLocaleString('vi-VN')} ₫</div>
              <div className="col-span-2 text-gray-700">x {d.quantity}</div>
              <div className="col-span-2 font-semibold text-green-700">{Number((d.unitPrice || 0) * (d.quantity || 0)).toLocaleString('vi-VN')} ₫</div>
            </div>
          ))}
          {details.length === 0 && (
            <div className="p-4 text-gray-500">Chưa có dòng hàng</div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-md p-4 grid md:grid-cols-2 gap-4">
        <div className="text-sm text-gray-600">Tổng số dòng: <b>{details.length}</b></div>
        <div className="space-y-2 text-right">
          <div>Tạm tính: <b>{subtotal.toLocaleString('vi-VN')} ₫</b></div>
          <div>Phí vận chuyển: <b>{shipping.toLocaleString('vi-VN')} ₫</b></div>
          <div>Giảm giá: <b>-{discount.toLocaleString('vi-VN')} ₫</b></div>
          <div className="text-lg font-semibold text-green-700">Tổng cộng: {total.toLocaleString('vi-VN')} ₫</div>
        </div>
      </div>
    </div>
  );
}


