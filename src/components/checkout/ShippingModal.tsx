import { useState } from 'react';
import { useCheckoutInfoStore } from '../../store/checkoutInfoStore';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ShippingModal({ open, onClose, onSaved }: Props) {
  const setShipping = useCheckoutInfoStore((s) => s.setShipping);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-[480px] p-4">
        <div className="text-lg font-semibold mb-3">Địa chỉ mới</div>
        <div className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Họ và tên" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Số điện thoại" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="Địa chỉ cụ thể" value={addressLine} onChange={(e)=>setAddressLine(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">Trở lại</button>
          <button onClick={()=>{ setShipping({ fullName, phone, addressLine }); onSaved(); onClose(); }} className="px-4 py-2 bg-green-600 text-white rounded-md">Hoàn thành</button>
        </div>
      </div>
    </div>
  );
}


