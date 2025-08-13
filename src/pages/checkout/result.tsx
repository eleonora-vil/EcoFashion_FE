import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckoutWizard } from '../../store/checkoutWizardStore';
import { ordersService } from '../../services/api/ordersService';

export default function CheckoutResultPage() {
  const navigate = useNavigate();
  const wizard = useCheckoutWizard();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmAndAdvance = async () => {
      // Nếu BE redirect kèm orderId, điều hướng wizard đến đúng order
      const orderIdFromQuery = Number(searchParams.get('orderId'));
      if (orderIdFromQuery && !Number.isNaN(orderIdFromQuery)) {
        wizard.goToOrder(orderIdFromQuery);
      }
      const current = wizard.orders[wizard.currentIndex];
      if (!current) {
        navigate('/orders');
        return;
      }
      try {
        setLoading(true);
        const resp = await ordersService.getById(current.orderId);
        const status = (resp as any)?.result?.paymentStatus || (resp as any)?.paymentStatus || (resp as any)?.status;
        const normalized = String(status || '').toLowerCase();
        if (normalized === 'paid' || normalized === 'processing') {
          wizard.markStatus(current.orderId, 'Paid');
        } else if (normalized === 'failed') {
          wizard.markStatus(current.orderId, 'Failed');
        } else {
          wizard.markStatus(current.orderId, 'Pending');
        }
      } catch (e: any) {
        setError(e?.message || 'Không xác nhận được trạng thái đơn');
      } finally {
        setLoading(false);
        wizard.next();
        const hasNext = wizard.currentIndex < wizard.orders.length - 1;
        navigate(hasNext ? '/checkout' : '/orders');
      }
    };
    confirmAndAdvance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div className="max-w-[1120px] mx-auto p-6 text-red-600">{error}</div>;
  }
  return <div className="max-w-[1120px] mx-auto p-6">Đang xác nhận trạng thái thanh toán...</div>;
}


