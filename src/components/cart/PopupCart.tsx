import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-toastify";

interface PopupCartProps {
  open: boolean;
  onClose: () => void;
}

const PopupCart: React.FC<PopupCartProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Animation: fade/slide in-out
  return (
    <div
      className={`absolute right-0 mt-2 w-80 md:w-96 bg-white border border-green-500 rounded-xl shadow-2xl z-50 transition-all duration-300 ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
      style={{ top: "120%" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5">
        <h4 className="font-semibold text-lg mb-4 text-green-700">Giỏ Hàng</h4>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Giỏ hàng trống</div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b pb-3 last:border-b-0 relative group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-500 font-bold">•</span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({item.type === "material" ? "Nguyên liệu" : "Sản phẩm"})
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.price.toLocaleString("vi-VN")} ₫/{item.unit || "cái"}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-red-100 text-red-500"
                    >
                      -
                    </button>
                    <span className="px-2">
                      {item.quantity} {item.unit || "cái"}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-green-100 text-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Nút xóa */}
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.success(`Đã xóa ${item.name} khỏi giỏ hàng`);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Xóa khỏi giỏ hàng"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold text-gray-700">Tạm tính :</span>
          <span className="font-bold text-green-700">
            {subtotal.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <div className="text-xs text-gray-500 text-center mt-1">
          {cartItems.length} loại sản phẩm
        </div>
        <div className="flex gap-2 mt-5">
          <button
            className="flex-1 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
            onClick={() => {
              onClose();
              navigate("/cart");
            }}
          >
            Xem Giỏ Hàng
          </button>
          <button
            className="flex-1 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600"
            onClick={() => {
              onClose();
              navigate("/checkout");
            }}
          >
            Thanh Toán
          </button>
        </div>
        {/* Nút xóa tất cả */}
        {cartItems.length > 0 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
                  )
                ) {
                  clearCart();
                  toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
                }
              }}
              className="text-sm text-red-500 hover:text-red-700 font-medium underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            💡 Gợi ý: Kiểm tra số lượng và đơn vị trước khi thanh toán
            <br />
            💡 Hover vào item để hiển thị nút xóa
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupCart;
