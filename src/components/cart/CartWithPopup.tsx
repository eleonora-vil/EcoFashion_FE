import React, { useEffect, useState } from "react";
import PopupCart from "./PopupCart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "../../store/cartStore";

interface CartWithPopupProps {
  // Không cần prop cartCount nữa, sẽ tự động tính từ store
}

const CartWithPopup: React.FC<CartWithPopupProps> = () => {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [cartOpen, setCartOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === "/";
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);
  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCartOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setCartOpen(false), 200); // 200ms delay
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700`}
        type="button"
        tabIndex={0}
        aria-label="Giỏ hàng"
      >
        <div className="relative">
          <ShoppingCartIcon
            className={`w-6 h-6 text-inherit hover:text-green-600 transition duration-200 ${
              scrolled || !isHome ? "text-gray-700" : "text-white"
            }`}
          />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center bg-white border-2 border-green-500 text-green-600 text-xs font-bold rounded-full w-5 h-5 shadow-sm select-none">
              {itemCount}
            </span>
          )}
        </div>
      </button>
      <PopupCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default CartWithPopup;
