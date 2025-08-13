import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (opts: { bankCode?: string }) => void;
}

export default function PaymentMethodModal({ open, onClose, onConfirm }: Props) {
  const [bankCode, setBankCode] = useState<string>('NCB');
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-[480px] p-4">
        <div className="text-lg font-semibold mb-3">Chọn phương thức thanh toán</div>
        <div className="space-y-3">
          <div className="font-medium">Cổng: VNPay</div>
          <label className="text-sm text-gray-600">Ngân hàng (sandbox):</label>
          <select className="w-full border rounded px-3 py-2" value={bankCode} onChange={(e)=>setBankCode(e.target.value)}>
            <option value="">Tự chọn trên VNPay</option>
            <option value="NCB">NCB (test)</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">Hủy</button>
          <button onClick={()=>{ onConfirm({ bankCode }); onClose(); }} className="px-4 py-2 bg-green-600 text-white rounded-md">Tiếp tục</button>
        </div>
      </div>
    </div>
  );
}


