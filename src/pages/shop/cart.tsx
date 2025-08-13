import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Aos from "aos";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
//----------------
import ShippingModal from "../../components/checkout/ShippingModal";
import { useState as useReactState } from 'react';
import bg from '../../assets/img/images/grid-image/fabric.png'

const formatVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function Cart() {
  const navigate = useNavigate();
//-----------------
  const [openShip, setOpenShip] = useReactState(false);
  const [pendingSellerId, setPendingSellerId] = useReactState<string | null>(null);
  const items = useCartStore((s) => s.items);
  const grouped = useMemo(() => {
    const groups: Record<string, typeof items> = {} as any;
    items.forEach((item) => {
      if (!groups[item.sellerId]) groups[item.sellerId] = [] as any;
      (groups[item.sellerId] as any).push(item);
    });
    return groups;
  }, [items]);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(items.map(i => i.id));
  }, [items.length]);

  const allSelected = selectedIds.length > 0 && selectedIds.length === items.length;
  const toggleAll = () => setSelectedIds(allSelected ? [] : items.map(i => i.id));
  const toggleOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectedSubtotal = useMemo(() => selectedIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean)
    .reduce((sum, i: any) => sum + i.price * i.quantity, 0), [selectedIds, items]);

  const vatRate = 0.05;
  const vat = Math.round(selectedSubtotal * vatRate);
  const total = selectedSubtotal + vat;
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <>
        

        <div
          className="relative w-full h-48 sm:h-60 md:h-72 bg-center bg-cover flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bg})`,
          }}
        >
          <div className="text-center w-full px-4">
            <h2 className="text-white text-4xl md:text-[40px] font-semibold leading-none">Cart</h2>
            <ul className="flex items-center justify-center gap-2 text-sm md:text-base font-medium text-white/90 mt-3">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>/</li>
              <li className="text-green-300">Cart</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12 mb-16 md:mb-24">
            <div className="max-w-[1120px] mx-auto px-3 sm:px-4 space-y-4 md:space-y-6 pb-10 md:pb-14">
                {/* Header  */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-4 bg-white border rounded-md text-gray-700 text-sm">
                  <div className="col-span-6 flex items-center gap-3">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4" />
                    <span>Sản phẩm</span>
                  </div>
                  <div className="col-span-2">Đơn giá</div>
                  <div className="col-span-2">Số lượng</div>
                  <div className="col-span-2">Số tiền</div>
                </div>

                {/* Items grouped by seller */}
                <div className="mt-2 space-y-4">
                  {items.length === 0 && (
                    <div className="p-10 text-center text-gray-500 bg-white rounded-md">Giỏ hàng trống</div>
                  )}
                  {Object.entries(grouped).map(([sellerId, sellerItems]) => {
                    const sellerName = sellerItems[0]?.sellerName || `Nhà cung cấp ${sellerId.substring(0, 6)}`;
                    const sellerSubtotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
                    return (
                      <div key={sellerId} className="border rounded-md bg-white">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                          <div className="font-semibold text-gray-900">{sellerName}</div>
                          <div className="text-sm text-gray-500">Tạm tính nhóm: <span className="font-medium text-green-700">{formatVND(sellerSubtotal)}</span></div>
                        </div>
                        <div className="divide-y">
                          {sellerItems.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3">
                              <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                                <input type="checkbox" className="w-4 h-4" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} />
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div>
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-xs text-gray-500">{item.type} • ĐVT: {item.unit}</div>
                                </div>
                              </div>
                              <div className="col-span-6 md:col-span-2 text-gray-900">{formatVND(item.price)}</div>
                              <div className="col-span-3 md:col-span-2 flex items-center gap-2">
                                <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 border rounded">-</button>
                                <span className="w-10 text-center">{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 border rounded">+</button>
                              </div>
                              <div className="col-span-3 md:col-span-2 font-semibold text-green-700">{formatVND(item.price * item.quantity)}</div>
                              <div className="col-span-12 md:col-span-12 flex md:justify-end">
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Xóa</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-end gap-3">
                          <button className="px-4 py-2 rounded-md border hover:bg-gray-100 text-sm">Lưu nhóm</button>
                          <button
                            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                            onClick={() => {
                              //-------------------
                              setPendingSellerId(sellerId);
                              setOpenShip(true);
                            }}
                          >
                            Thanh toán nhóm này
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom bar */}
                <div className="sticky bottom-0 mt-6 bg-white border-t p-4 flex flex-col md:flex-row items-center justify-between gap-3 max-w-[1120px] mx-auto">
                  <div className="flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4" />
                    <span>Chọn tất cả ({items.length})</span>
                    <button className="text-red-500 hover:underline" onClick={() => selectedIds.forEach(id => removeFromCart(id))}>Xóa</button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Tổng tiền ({selectedIds.length} sản phẩm):</div>
                      <div className="text-2xl font-semibold text-green-700">{formatVND(total)}</div>
                    </div>
                    <button disabled={selectedIds.length === 0} onClick={() => navigate('/checkout')} className={`px-6 py-3 rounded-md text-white ${selectedIds.length === 0 ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700'}`}>Mua Hàng</button>
                  </div>
                </div>
            </div>
        </div>

        {/* Shipping modal */}
        <ShippingModal
          open={openShip}
          onClose={() => setOpenShip(false)}
          onSaved={() => {
            if (pendingSellerId) {
              const params = new URLSearchParams({ groupSellerId: pendingSellerId });
              navigate(`/checkout?${params.toString()}`);
            }
          }}
        />

    </>
  )
}
