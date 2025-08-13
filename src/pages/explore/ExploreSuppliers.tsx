// Utility function to fallback image URL safely
function safeImageUrl(
  url?: string,
  fallback: string = "/assets/default-image.jpg"
): string {
  return typeof url === "string" && url.trim() ? url : fallback;
}
import "./ExploreSuppliers.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SupplierService,
  type SupplierSummary,
} from "../../services/api/supplierService";
import { toast } from "react-toastify";

export default function ExploreSuppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    loadSuppliers();
  }, [currentPage]);
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupplierService.getPublicSuppliers(
        currentPage,
        pageSize
      );
      setSuppliers(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà cung cấp";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSuppliers();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const searchResults = await SupplierService.searchPublicSuppliers(
        searchQuery,
        1,
        pageSize
      );
      setSuppliers(searchResults);
    } catch (error: any) {
      const errorMessage = error.message || "Lỗi khi tìm kiếm nhà cung cấp";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        loadSuppliers();
      }
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);
  const handleSupplierClick = (supplierId: string) => {
    navigate(`/explore/suppliers/${supplierId}`);
  };
  const totalRating = suppliers.reduce((sum, s) => sum + (s.rating || 0), 0);
  const averageRating =
    suppliers.length > 0 ? (totalRating / suppliers.length).toFixed(1) : "0";
  const totalReviews = suppliers.reduce(
    (sum, s) => sum + (s.reviewCount || 0),
    0
  );

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Khám Phá Nhà Cung Cấp</h1>
        <p>
          Tìm kiếm những nhà cung cấp uy tín và chất lượng cho dự án của bạn
        </p>
        <input
          className="explore-search"
          type="text"
          placeholder="Tìm kiếm nhà cung cấp..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="explore-stats">
        <div className="stat-card">
          <div className="stat-value">{suppliers.length}</div>
          <div className="stat-label">Nhà Cung Cấp</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🌱 100%</div>
          <div className="stat-label">Bền Vững</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageRating}</div>
          <div className="stat-label">Đánh Giá TB</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalReviews.toLocaleString()}</div>
          <div className="stat-label">Lượt Đánh Giá</div>
        </div>
      </div>
      {error && <div className="explore-error">{error}</div>}
      {loading && <div className="explore-loading">Đang tải...</div>}
      {!loading && suppliers.length === 0 && (
        <div className="explore-empty">
          <div style={{ fontSize: 48, color: "#bdbdbd" }}>🏢</div>
          <h3>
            {searchQuery
              ? "Không tìm thấy nhà cung cấp nào"
              : "Chưa có nhà cung cấp nào"}
          </h3>
          <p>
            {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Hãy quay lại sau"}
          </p>
        </div>
      )}
      {!loading && suppliers.length > 0 && (
        <div className="explore-grid">
          {suppliers.map((supplier) => (
            <div
              className="designer-card"
              key={supplier.supplierId}
              onClick={() => handleSupplierClick(supplier.supplierId)}
            >
              <div
                className="designer-banner"
                style={{
                  backgroundImage: `url(${safeImageUrl(
                    supplier.bannerUrl,
                    "/assets/default-banner.jpg"
                  )})`,
                }}
              />
              <div className="designer-content">
                <div className="designer-avatar-name">
                  <img
                    className="designer-avatar"
                    src={safeImageUrl(
                      supplier.avatarUrl,
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
                  <div className="designer-info">
                    <div className="designer-name-row">
                      <span className="designer-name">
                        {supplier.supplierName || "Nhà cung cấp"}
                      </span>
                      <span className="designer-verified" title="Đã xác thực">
                        ✔️
                      </span>
                    </div>
                    <div className="designer-joined">
                      Thành viên từ {new Date(supplier.createdAt).getFullYear()}
                    </div>
                  </div>
                </div>
                <div className="designer-bio">
                  {supplier.bio ||
                    "Nhà cung cấp chuyên nghiệp với nhiều năm kinh nghiệm"}
                </div>
                <div className="designer-rating-row">
                  <span className="designer-rating">
                    ⭐ {supplier.rating?.toFixed(1) || "0"}
                  </span>
                  <span className="designer-reviews">
                    ({supplier.reviewCount || 0})
                  </span>
                </div>
                <div className="designer-tags">
                  <span className="designer-tag">🌱 Bền vững</span>
                  <span className="designer-tag">🏢 Uy tín</span>
                </div>
                <button className="designer-detail-btn">Xem Chi Tiết</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && suppliers.length >= pageSize && (
        <div className="explore-loadmore">
          <button
            className="designer-loadmore-btn"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Xem Thêm
          </button>
        </div>
      )}
    </div>
  );
}
