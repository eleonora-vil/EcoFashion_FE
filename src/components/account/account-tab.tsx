import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AccountTab() {
    const [current , setCurrent] = useState<string>('')

    useEffect(()=>{
        setCurrent(window.location.pathname)
    },[])


  return (
    <ul className="divide-y dark:divide-paragraph text-title dark:text-white text-base sm:text-lg lg:text-xl flex flex-col justify-center leading-none">
        <li className={` py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/supplier/profile' || current === '/designer/profile' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to={current.includes('designer') ? "/designer/profile" : "/supplier/profile"}>Trang Cá Nhân</Link>
        </li>
        <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/supplier/detailed-profile' || current === '/designer/detailed-profile' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to={current.includes('designer') ? "/designer/detailed-profile" : "/supplier/detailed-profile"}>Thông tin chi tiết</Link>
        </li>
        <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/edit-account' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to="/edit-account">Chỉnh sửa tài khoản</Link>
        </li>        
        <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/order-history' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to="/order-history">Lịch sử đặt hàng</Link>
        </li>
        <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/wishlist' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to="/wishlist">Wishlist</Link>
        </li>
        <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/login' ? 'active text-primary' :''}`}>
            <Link className="duration-300 hover:text-primary" to="/login">Logout</Link>
        </li>
    </ul>
  )
}
