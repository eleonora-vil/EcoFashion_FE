import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import bg from '../../assets/img/images/grid-image/fabric.png';
export default function OrdersPage() {

  return (
    <>
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bg})`,
        }}
      >
        <div className="text-center w-full px-4">
          <h2 className="text-white text-4xl md:text-[40px] font-semibold leading-none">Orders</h2>
          <ul className="flex items-center justify-center gap-2 text-sm md:text-base font-medium text-white/90 mt-3">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>/</li>
            <li className="text-green-300">Orders</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 md:mt-10 lg:mt-12 mb-16 md:mb-24">
        <div className="max-w-[1120px] mx-auto px-3 sm:px-4 space-y-4 md:space-y-6 pb-10 md:pb-14">
          <Outlet />
          <div className="mt-4"><Link to="/cart" className="text-green-700 hover:underline">Tiếp tục mua hàng</Link></div>
        </div>
      </div>
    </>
  );
}


