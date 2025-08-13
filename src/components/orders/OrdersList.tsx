import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersService, type OrderModel } from '../../services/api/ordersService';
import { formatViDateTime } from '../../utils/date';

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const getFulfillmentStatusColor = (status?: string, paymentStatus?: string) => {
  // Auto-fix: nếu đã paid nhưng fulfillment = none, hiển thị màu xanh
  if (paymentStatus?.toLowerCase() === 'paid' && (!status || status.toLowerCase() === 'none')) {
    return 'bg-green-100 text-green-700';
  }
  
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'canceled': return 'bg-red-100 text-red-700';
    case 'none':
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getFulfillmentStatusLabel = (status?: string, paymentStatus?: string) => {
  // Auto-fix: nếu đã paid nhưng fulfillment = none, hiển thị hoàn thành
  if (paymentStatus?.toLowerCase() === 'paid' && (!status || status.toLowerCase() === 'none')) {
    return '✅ Hoàn thành';
  }
  
  switch (status?.toLowerCase()) {
    case 'delivered': return '✅ Hoàn thành';
    case 'shipped': return '🚚 Đang giao';
    case 'processing': return '📦 Đang xử lý';
    case 'canceled': return '❌ Đã hủy';
    case 'none':
    default: return '⏳ Chưa xử lý';
  }
};

export default function OrdersList() {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await ordersService.getAll();
        // Filter chỉ hiển thị orders đã paid (ẩn pending payments)
        const filteredOrders = data.filter(order => 
          order.paymentStatus && 
          order.paymentStatus.toLowerCase() === 'paid'
        );
        setOrders(filteredOrders);
      } catch (e: any) {
        setError(e?.message || 'Không tải được danh sách đơn');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Đang tải đơn hàng...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="bg-white border rounded-md">
      <div className="grid grid-cols-12 px-4 py-3 border-b text-sm text-gray-600">
        <div className="col-span-2">Mã đơn</div>
        <div className="col-span-2">Ngày đặt</div>
        <div className="col-span-2">Người bán</div>
        <div className="col-span-2">Tổng tiền</div>
        <div className="col-span-2">Thanh toán</div>
        <div className="col-span-2">Vận chuyển</div>
      </div>
      {orders.map((o) => (
        <button
          key={o.orderId}
          className="grid grid-cols-12 px-4 py-3 border-b items-center w-full text-left hover:bg-gray-50"
          onClick={() => navigate(`/orders/${o.orderId}`)}
        >
          <div className="col-span-2 font-medium">#{o.orderId}</div>
          <div className="col-span-2 text-sm text-gray-700">{o.orderDate ? formatViDateTime(o.orderDate) : '-'}</div>
          <div className="col-span-2 text-sm text-gray-700 flex items-center gap-2">
            {o.sellerAvatarUrl ? (
              <img src={o.sellerAvatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            )}
            <span>{o.sellerName || '—'}</span>
          </div>
          <div className="col-span-2 font-semibold text-green-700">{formatVND(Number(o.totalPrice || 0))}</div>
          <div className="col-span-2">
            <span className={`px-2 py-1 rounded text-xs ${String(o.paymentStatus || '').toLowerCase()==='paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {o.paymentStatus || 'Pending'}
            </span>
          </div>
          <div className="col-span-2">
            <span className={`px-2 py-1 rounded text-xs ${getFulfillmentStatusColor(o.fulfillmentStatus, o.paymentStatus)}`}>
              {getFulfillmentStatusLabel(o.fulfillmentStatus, o.paymentStatus)}
            </span>
          </div>
        </button>
      ))}
      {orders.length === 0 && <div className="p-6 text-center text-gray-500">Chưa có đơn hàng</div>}
    </div>
  );
}


