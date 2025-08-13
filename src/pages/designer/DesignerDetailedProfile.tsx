import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DesignerService,
  type DesignerModel,
} from "../../services/api/designerService";
import bg from "../../assets/pictures/homepage/banner.jpg";
import AccountTab from "../../components/account/account-tab";
import ScrollToTop from "../../components/scroll-to-top";
import {
  LuMail,
  LuMapPin,
  LuPhoneCall,
  LuUser,
  LuBuilding,
  LuCalendar,
  LuMapPin as LuLocation,
  LuGlobe,
  LuFileText,
  LuStar,
  LuIdCard,
  LuTag,
  LuAward,
  LuFolderOpen,
  LuTarget,
  LuTrendingUp,
  LuMessageSquare,
  LuImage,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import Aos from "aos";
import { useAuthStore } from "../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Component cho thông tin chi tiết từ backend
function DesignerDetailedInfo({ designer }: { designer: DesignerModel }) {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  return (
    <div className="space-y-8">
      {/* Thông tin cơ bản */}
      <div
        className="grid gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h4 className="font-semibold text-lg text-gray-800 mb-3">
          Thông tin cơ bản
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuUser className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Tên nhà thiết kế</p>
              <p className="font-medium">
                {designer.designerName || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuIdCard className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Mã nhà thiết kế</p>
              <p className="font-medium">{designer.designerId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuCalendar className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Ngày tham gia</p>
              <p className="font-medium">
                {designer.createdAt
                  ? new Date(designer.createdAt).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuStar className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <p className="font-medium text-green-600 capitalize">
                {designer.status || "Hoạt động"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div
        className="grid gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <h4 className="font-semibold text-lg text-gray-800 mb-3">
          Thông tin liên hệ
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuMail className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{designer.email || "Chưa cập nhật"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuPhoneCall className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">
                {designer.phoneNumber || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuLocation className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Địa chỉ</p>
              <p className="font-medium">
                {designer.address || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuBuilding className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{designer.userId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin pháp lý */}
      <div
        className="grid gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <h4 className="font-semibold text-lg text-gray-800 mb-3">
          Thông tin pháp lý
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuTag className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Mã số thuế</p>
              <p className="font-medium">
                {designer.taxNumber || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuIdCard className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Số CMND/CCCD</p>
              <p className="font-medium">
                {designer.identificationNumber || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Ảnh CCCD */}
        <div
          className="grid gap-4 sm:gap-6"
          data-aos="fade-up"
          data-aos-delay="450"
        >
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-700">Ảnh CCCD/CMND</h5>
            <button
              onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {showSensitiveInfo ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              {showSensitiveInfo ? "Ẩn" : "Hiện"} thông tin nhạy cảm
            </button>
          </div>

          {showSensitiveInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h6 className="font-medium text-gray-700 mb-3">
                  Mặt trước CCCD
                </h6>
                {designer.identificationPictureFront ? (
                  <img
                    src={designer.identificationPictureFront}
                    alt="CCCD mặt trước"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/default-image.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LuImage className="text-gray-400 size-8 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Chưa có ảnh</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <h6 className="font-medium text-gray-700 mb-3">Mặt sau CCCD</h6>
                {designer.identificationPictureBack ? (
                  <img
                    src={designer.identificationPictureBack}
                    alt="CCCD mặt sau"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/default-image.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LuImage className="text-gray-400 size-8 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Chưa có ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thông tin chuyên môn */}
      <div
        className="grid gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <h4 className="font-semibold text-lg text-gray-800 mb-3">
          Thông tin chuyên môn
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuTarget className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Chuyên môn</p>
              <p className="font-medium">
                {designer.specializationUrl ? "Đã cập nhật" : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuFolderOpen className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Portfolio</p>
              <p className="font-medium">
                {designer.portfolioUrl ? "Đã cập nhật" : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuAward className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Chứng chỉ</p>
              <p className="font-medium">
                {designer.certificates ? "Đã cập nhật" : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuFileText className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Tài liệu</p>
              <p className="font-medium">
                {designer.portfolioFiles ? "Đã cập nhật" : "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Hiển thị ảnh chứng chỉ và tài liệu nếu có */}
        {showSensitiveInfo && (
          <div
            className="grid gap-4 sm:gap-6"
            data-aos="fade-up"
            data-aos-delay="550"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designer.certificates && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h6 className="font-medium text-gray-700 mb-3">Chứng chỉ</h6>
                  <img
                    src={designer.certificates}
                    alt="Chứng chỉ"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/default-image.png";
                    }}
                  />
                </div>
              )}

              {designer.portfolioFiles && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h6 className="font-medium text-gray-700 mb-3">Tài liệu</h6>
                  <img
                    src={designer.portfolioFiles}
                    alt="Tài liệu"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/assets/default-image.png";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Đánh giá và nhận xét */}
      <div
        className="grid gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <h4 className="font-semibold text-lg text-gray-800 mb-3">
          Đánh giá và nhận xét
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuTrendingUp className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Điểm đánh giá</p>
              <p className="font-medium">
                {designer.rating ? `${designer.rating}/5` : "Chưa có đánh giá"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <LuMessageSquare className="text-primary size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Số nhận xét</p>
              <p className="font-medium">
                {designer.reviewCount || 0} nhận xét
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin cập nhật */}
      {designer.updatedAt && (
        <div
          className="grid gap-4 sm:gap-6"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            Thông tin cập nhật
          </h4>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <LuCalendar className="text-blue-600 size-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="font-medium">
                {new Date(designer.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesignerDetailedProfile() {
  const { user, designerProfile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Sử dụng React Query để fetch designer profile
  const {
    data: designer,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["designer-detailed-profile"],
    queryFn: async () => {
      try {
        const data = await DesignerService.getDesignerProfile();
        return data;
      } catch (err: any) {
        throw new Error(err.message || "Không thể tải thông tin nhà thiết kế.");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    retry: 2,
  });

  // Xử lý error
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
      toast.error("Lỗi khi tải thông tin nhà thiết kế");
    }
  }, [queryError]);

  useEffect(() => {
    Aos.init();
  }, []);

  // Kết hợp data từ auth store và API
  const combinedDesigner = {
    ...designer,
    ...designerProfile,
    user: {
      ...designer?.user,
      ...user,
    },
  };

  // Xác định banner và avatar
  const bannerUrl =
    combinedDesigner?.bannerUrl && combinedDesigner.bannerUrl.trim()
      ? combinedDesigner.bannerUrl
      : bg;

  const avatarUrl =
    combinedDesigner?.avatarUrl && combinedDesigner.avatarUrl.trim()
      ? combinedDesigner.avatarUrl
      : combinedDesigner?.user?.avatarUrl
      ? combinedDesigner.user.avatarUrl
      : "/assets/default-avatar.png";

  return (
    <>
      <div
        className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="text-center w-full flex flex-col items-center">
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full w-24 h-24 object-cover border-4 border-white mb-4 shadow-lg"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/assets/default-avatar.png";
            }}
          />
          <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">
            Thông Tin Chi Tiết
          </h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>/</li>
            <li className="text-primary">Thông tin chi tiết</li>
          </ul>
        </div>
      </div>

      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            <div
              className="w-full md:w-[200px] lg:w-[300px] flex-none"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <AccountTab />
            </div>
            <div className="w-full md:w-auto md:flex-1 overflow-auto">
              <div className="w-full max-w-[951px] bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                      Đang tải thông tin chi tiết...
                    </p>
                  </div>
                ) : error || queryError ? (
                  <div className="text-center text-red-500 py-10">
                    {error ||
                      queryError?.message ||
                      "Có lỗi xảy ra khi tải thông tin"}
                  </div>
                ) : designer ? (
                  <DesignerDetailedInfo designer={designer} />
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    Không tìm thấy thông tin nhà thiết kế
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
