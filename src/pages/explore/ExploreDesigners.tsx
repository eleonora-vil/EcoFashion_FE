// Utility function to fallback image URL safely
function safeImageUrl(
  url?: string,
  fallback: string = "/assets/default-image.jpg"
): string {
  return typeof url === "string" && url.trim() ? url : fallback;
}
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Box,
  Chip,
  Button,
  Rating,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import "./ExploreDesigners.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LocationOn,
  Star,
  Palette,
  Person,
  Verified,
} from "@mui/icons-material";
import { EcoIcon } from "../../assets/icons/icon";
import { DesignerService } from "../../services/api/designerService";
import { toast } from "react-toastify";

type DesignerSummaryExtra = {
  designerId: string;
  designerName?: string;
  avatarUrl?: string;
  bio?: string;
  bannerUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  taxNumber?: string;
  identificationPictureOwner?: string;
};

const ExploreDesignersPage: React.FC = () => {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState<DesignerSummaryExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    loadDesigners();
  }, [currentPage]);

  const loadDesigners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DesignerService.getPublicDesigners(
        currentPage,
        pageSize
      );
      setDesigners(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà thiết kế";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDesigners();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const searchResults = await DesignerService.searchPublicDesigners(
        searchQuery,
        1,
        pageSize
      );
      setDesigners(searchResults);
    } catch (error: any) {
      const errorMessage = error.message || "Lỗi khi tìm kiếm nhà thiết kế";
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
        loadDesigners();
      }
    }, 500);
    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleDesignerClick = (designerId: string) => {
    navigate(`/explore/designers/${designerId}`);
  };

  const totalRating = designers.reduce((sum, d) => sum + (d.rating || 0), 0);
  const averageRating =
    designers.length > 0 ? (totalRating / designers.length).toFixed(1) : "0";
  const totalReviews = designers.reduce(
    (sum, d) => sum + (d.reviewCount || 0),
    0
  );

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Khám Phá Nhà Thiết Kế</h1>
        <p>Tìm hiểu về các nhà thiết kế thời trang bền vững tài năng</p>
        <input
          className="explore-search"
          type="text"
          placeholder="Tìm kiếm nhà thiết kế..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="explore-stats">
        <div className="stat-card">
          <div className="stat-value">{designers.length}</div>
          <div className="stat-label">Nhà Thiết Kế</div>
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
      {!loading && designers.length === 0 && (
        <div className="explore-empty">
          <div style={{ fontSize: 48, color: "#bdbdbd" }}>👤</div>
          <h3>
            {searchQuery
              ? "Không tìm thấy nhà thiết kế nào"
              : "Chưa có nhà thiết kế nào"}
          </h3>
          <p>
            {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Hãy quay lại sau"}
          </p>
        </div>
      )}
      {!loading && designers.length > 0 && (
        <div className="explore-grid">
          {designers.map((designer) => (
            <div
              className="designer-card"
              key={designer.designerId}
              onClick={() => handleDesignerClick(designer.designerId)}
            >
              <div
                className="designer-banner"
                style={{
                  backgroundImage: `url(${safeImageUrl(
                    designer.bannerUrl,
                    "/assets/default-banner.jpg"
                  )})`,
                }}
              />
              <div className="designer-content">
                <div className="designer-avatar-name">
                  <img
                    className="designer-avatar"
                    src={safeImageUrl(
                      designer.avatarUrl,
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
                        {designer.designerName || "Nhà thiết kế"}
                      </span>
                      <span className="designer-verified" title="Đã xác thực">
                        ✔️
                      </span>
                    </div>
                    <div className="designer-joined">
                      Thành viên từ {new Date(designer.createdAt).getFullYear()}
                    </div>
                  </div>
                </div>
                <div className="designer-bio">
                  {designer.bio || "Chuyên thiết kế thời trang bền vững"}
                </div>
                {designer.taxNumber && (
                  <div className="designer-extra">
                    <strong>Mã số thuế:</strong> {designer.taxNumber}
                  </div>
                )}
                {designer.identificationPictureOwner && (
                  <div className="designer-extra">
                    <strong>Chủ sở hữu ảnh định danh:</strong>{" "}
                    {designer.identificationPictureOwner}
                  </div>
                )}
                <div className="designer-rating-row">
                  <span className="designer-rating">
                    ⭐ {designer.rating?.toFixed(1) || "0"}
                  </span>
                  <span className="designer-reviews">
                    ({designer.reviewCount || 0})
                  </span>
                </div>
                <div className="designer-tags">
                  <span className="designer-tag">🌱 Bền vững</span>
                  <span className="designer-tag">🎨 Thiết kế</span>
                </div>
                <button className="designer-detail-btn">Xem Chi Tiết</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && designers.length >= pageSize && (
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
};

export default ExploreDesignersPage;
