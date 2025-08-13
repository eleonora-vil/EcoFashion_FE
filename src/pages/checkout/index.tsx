import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { checkoutService, type CartItemDto } from '../../services/api/checkoutService';
import { paymentsService } from '../../services/api/paymentsService';
import { useCheckoutWizard } from '../../store/checkoutWizardStore';
//---------
import { useCheckoutInfoStore } from '../../store/checkoutInfoStore';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const wizard = useCheckoutWizard();
//-----------
  const shipping = useCheckoutInfoStore((s) => s.shipping);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [openPayment, setOpenPayment] = useState(false);
  const [preferredBank, setPreferredBank] = useState<string | undefined>(undefined);

  const cartToPayload = useMemo(() => {
    // Nếu có groupSellerId trong query, chỉ lấy items thuộc seller đó
    const onlySellerId = searchParams.get('groupSellerId');
    const filtered = onlySellerId ? items.filter(i => i.sellerId === onlySellerId) : items;
    const payload: CartItemDto[] = filtered.map((i) => ({
      itemType: i.type === 'material' ? 'material' : 'design',
      materialId: i.type === 'material' ? Number(i.id) : undefined,
      designId: i.type === 'design' ? Number(i.id) : undefined,
      sellerId: i.sellerId,
      sellerType: 'Supplier',
      quantity: i.quantity,
      unitPrice: i.price,
    }));
    return payload;
  }, [items, searchParams]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!items.length) {
        navigate('/cart');
        return;
      }
      try {
        setLoading(true);
        const resp = await checkoutService.createSession({
          items: cartToPayload,
          shippingAddress: shipping ? `${shipping.fullName} | ${shipping.phone} | ${shipping.addressLine}` : 'Địa chỉ giao hàng',
          holdMinutes: 30,
        });
        wizard.start(resp);
      } catch (e: any) {
        setError(e?.message || 'Không tạo được session');
      } finally {
        setLoading(false);
      }
    };
    if (!wizard.orderGroupId) {
      bootstrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentOrder = wizard.orders[wizard.currentIndex];

  const handlePay = async () => {
    if (!currentOrder) return;
    if (preferredBank === undefined) {
      setOpenPayment(true);
      return;
    }
    try {
      setLoading(true);
      const { redirectUrl } = await paymentsService.createVnpay({
        orderId: currentOrder.orderId,
        amount: currentOrder.totalAmount,
        createdDate: new Date().toISOString(),
        bankCode: preferredBank || undefined,
        fullName: shipping?.fullName || 'Khach hang',
        description: `Thanh toan don hang: ${currentOrder.orderId}`,
      });
      window.location.href = redirectUrl;
    } catch (e: any) {
      setError(e?.message || 'Không tạo được link thanh toán');
      setLoading(false);
    }
  };

  const handleRetry = async (orderId: number) => {
    try {
      setLoading(true);
      const order = wizard.orders.find(o => o.orderId === orderId);
      if (!order) return;
      const { redirectUrl } = await paymentsService.createVnpay({
        orderId: order.orderId,
        amount: order.totalAmount,
        createdDate: new Date().toISOString(),
        bankCode: preferredBank || undefined,
        fullName: shipping?.fullName || 'Khach hang',
        description: `Thanh toan don hang: ${order.orderId}`,
      });
      window.location.href = redirectUrl;
    } catch (e: any) {
      setError(e?.message || 'Không tạo được link thanh toán');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (!currentOrder) return;
    wizard.markStatus(currentOrder.orderId, 'Skipped');
    wizard.next();
    if (wizard.currentIndex >= wizard.orders.length - 1) {
      clearCart();
    }
  };

  if (loading && !wizard.orders.length) {
    return <div className="max-w-[1120px] mx-auto p-6">Đang tạo phiên thanh toán...</div>;
  }
  if (error) {
    return <div className="max-w-[1120px] mx-auto p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Thanh toán theo từng nhà cung cấp</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {wizard.orders.map((o, idx) => (
            <div key={o.orderId} className={`border rounded-md ${idx === wizard.currentIndex ? 'ring-2 ring-green-600' : ''}`}>
              <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
                <div className="font-medium">Đơn #{o.orderId} • {o.sellerType}</div>
                <div className="text-sm text-gray-500">Tổng: <span className="font-semibold text-green-700">{formatVND(o.totalAmount)}</span></div>
              </div>
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <div className="text-sm flex items-center gap-2">
                  Trạng thái:
                  <span className={`font-medium ${wizard.statusByOrderId[o.orderId]==='Failed' ? 'text-red-600' : wizard.statusByOrderId[o.orderId]==='Paid' ? 'text-green-700' : 'text-gray-800'}`}>
                    {wizard.statusByOrderId[o.orderId]}
                  </span>
                </div>
                <div className="flex gap-2">
                  {wizard.statusByOrderId[o.orderId] === 'Failed' && (
                    <button onClick={() => handleRetry(o.orderId)} className="px-4 py-2 border rounded-md">Thử lại</button>
                  )}
                  {idx === wizard.currentIndex && (
                    <>
                      <button onClick={handleSkip} className="px-4 py-2 border rounded-md">Bỏ qua</button>
                      <button onClick={handlePay} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">Thanh toán đơn này</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border rounded-md p-4 bg-white">
            <div className="font-medium mb-2">Tiến trình</div>
            <div className="text-sm">Đơn hiện tại: {wizard.currentIndex + 1}/{wizard.orders.length}</div>
            <div className="text-sm">Hết hạn: {wizard.expiresAt ? new Date(wizard.expiresAt).toLocaleString() : '-'}</div>
          </div>
        </div>
      </div>

      <PaymentMethodModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        onConfirm={({ bankCode }) => {
          setPreferredBank(bankCode ?? '');
          setTimeout(() => handlePay(), 0);
        }}
      />
    </div>
  );
}


