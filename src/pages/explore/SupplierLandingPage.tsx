import "./SupplierLandingPage.css";
import { useState, useEffect } from "react";
// Utility function to fallback image URL safely
function safeImageUrl(
  url?: string,
  fallback: string = "/assets/default-image.jpg"
): string {
  return typeof url === "string" && url.trim() ? url : fallback;
}
import { useParams, useNavigate } from "react-router-dom";
import {
  SupplierService,
  type SupplierPublic,
} from "../../services/api/supplierService";
import { toast } from "react-toastify";

export default function SupplierLandingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierData, setSupplierData] = useState<SupplierPublic | null>(null);

  useEffect(() => {
    const loadSupplierData = async () => {
      if (!id) {
        setError("Invalid supplier ID");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await SupplierService.getSupplierPublicProfile(id);
        setSupplierData(data);
      } catch (error: any) {
        const errorMessage =
          error.message || "Không thể tải thông tin nhà cung cấp";
        setError(errorMessage);
        toast.error(errorMessage, { position: "bottom-center" });
      } finally {
        setLoading(false);
      }
    };
    loadSupplierData();
  }, [id]);

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="supplier-loading">
          Đang tải thông tin nhà cung cấp...
        </div>
      </div>
    );
  }
  if (error || !supplierData) {
    return (
      <div className="supplier-container">
        <button
          className="supplier-back-btn"
          onClick={() => navigate("/explore/suppliers")}
        >
          ← Quay lại danh sách
        </button>
        <div className="supplier-error">
          {error || "Không tìm thấy thông tin nhà cung cấp"}
        </div>
        <button
          className="supplier-back-btn"
          onClick={() => navigate("/explore/suppliers")}
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }
  return (
    <div className="supplier-container">
      <button
        className="supplier-back-btn"
        onClick={() => navigate("/explore/suppliers")}
      >
        ← Quay lại danh sách
      </button>
      <div
        className="supplier-banner"
        style={{
          backgroundImage: `url(${safeImageUrl(
            supplierData.bannerUrl,
            "/assets/default-banner.jpg"
          )})`,
        }}
      >
        <div className="supplier-banner-overlay" />
        <div className="supplier-banner-content">
          <img
            className="supplier-avatar"
            src={safeImageUrl(
              supplierData.avatarUrl,
              "/assets/default-avatar.png"
            )}
            alt="avatar"
            onError={(e) => {
              if (
                e.currentTarget.src !==
                window.location.origin + "/assets/default-avatar.png"
              ) {
                e.currentTarget.src = "/assets/default-avatar.png";
              }
            }}
          />
          <div className="supplier-banner-info">
            <h2>
              {supplierData.supplierName ||
                supplierData.userFullName ||
                "Nhà cung cấp"}
            </h2>
            <div className="supplier-banner-tags">
              <span className="supplier-chip">🏢 Nhà Cung Cấp</span>
              <span className="supplier-chip-outline">
                Thành viên từ {new Date(supplierData.createdAt).getFullYear()}
              </span>
              <span className="supplier-rating">
                ⭐ {supplierData.rating?.toFixed(1) || "0"} (
                {supplierData.reviewCount || 0} đánh giá)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="supplier-content-section">
        <div className="supplier-main-info">
          <div className="supplier-card">
            <h3 className="supplier-section-title">🏢 Giới thiệu</h3>
            <div className="supplier-bio">
              {supplierData.bio ||
                "Nhà cung cấp chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực cung cấp nguyên liệu và dịch vụ chất lượng cao, cam kết mang đến những sản phẩm tốt nhất cho khách hàng."}
            </div>
            <div className="supplier-tags">
              <span className="supplier-tag">🌱 Nguyên liệu bền vững</span>
              <span className="supplier-tag">🏢 Uy tín cao</span>
              <span className="supplier-tag">✔️ Chất lượng đảm bảo</span>
            </div>
          </div>
          {supplierData.portfolioUrl && (
            <div className="supplier-card">
              <h3 className="supplier-section-title">🌐 Portfolio</h3>
              <a
                className="supplier-portfolio-btn"
                href={supplierData.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem Portfolio
              </a>
            </div>
          )}
          {supplierData.certificates && (
            <div className="supplier-card">
              <h3 className="supplier-section-title">
                🎖️ Chứng chỉ & Giải thưởng
              </h3>
              <div className="supplier-certificates">
                {supplierData.certificates}
              </div>
            </div>
          )}
        </div>
        <div className="supplier-side-info">
          <div className="supplier-card">
            <h3 className="supplier-section-title">📞 Thông tin liên hệ</h3>
            <div className="supplier-contact-list">
              {supplierData.email && (
                <div className="supplier-contact-item">
                  <span className="supplier-contact-label">Email:</span>
                  <span>{supplierData.email}</span>
                </div>
              )}
              {supplierData.phoneNumber && (
                <div className="supplier-contact-item">
                  <span className="supplier-contact-label">Số điện thoại:</span>
                  <span>{supplierData.phoneNumber}</span>
                </div>
              )}
              {supplierData.address && (
                <div className="supplier-contact-item">
                  <span className="supplier-contact-label">Địa chỉ:</span>
                  <span>{supplierData.address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="supplier-card">
            <h3 className="supplier-section-title">📊 Thống kê</h3>
            <div className="supplier-stats-list">
              <div className="supplier-stats-item">
                <span>Đánh giá trung bình:</span>
                <span className="supplier-rating">
                  {supplierData.rating?.toFixed(1) || "0"}/5
                </span>
              </div>
              <div className="supplier-stats-item">
                <span>Tổng đánh giá:</span>
                <span className="supplier-rating">
                  {supplierData.reviewCount || 0}
                </span>
              </div>
              <div className="supplier-stats-item">
                <span>Thành viên từ:</span>
                <span>{new Date(supplierData.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
