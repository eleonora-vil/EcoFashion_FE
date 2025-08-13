import "./DesignerLandingPage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DesignerService,
  type DesignerPublic,
} from "../../services/api/designerService";
import { toast } from "react-toastify";

// Utility function to check if a string is a valid JSON array
function isValidJsonArray(jsonStr: string | undefined | null): boolean {
  if (typeof jsonStr !== "string" || !jsonStr.trim().startsWith("["))
    return false;
  try {
    const arr = JSON.parse(jsonStr);
    return Array.isArray(arr);
  } catch {
    return false;
  }
}

// Utility function to fallback image URL safely
function safeImageUrl(
  url?: string,
  fallback: string = "/assets/default-image.jpg"
): string {
  return typeof url === "string" && url.trim() ? url : fallback;
}

// Utility function to check valid JSON object
function isValidJsonObject(jsonStr: string | undefined | null): boolean {
  if (typeof jsonStr !== "string" || !jsonStr.trim().startsWith("{"))
    return false;
  try {
    const obj = JSON.parse(jsonStr);
    return typeof obj === "object" && obj !== null && !Array.isArray(obj);
  } catch {
    return false;
  }
}

export default function DesignerLandingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designer, setDesigner] = useState<DesignerPublic | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDesigner = async () => {
      try {
        setLoading(true);
        const data = await DesignerService.getDesignerPublicProfile(id);
        setDesigner(data);
      } catch (err: any) {
        const msg = err.message || "Không thể tải thông tin nhà thiết kế.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigner();
  }, [id]);

  if (loading) return <div className="designer-loading">Đang tải...</div>;
  if (error || !designer)
    return (
      <div className="designer-error">
        <p>{error || "Không tìm thấy designer."}</p>
        <button onClick={() => navigate("/explore/designers")}>
          ← Quay lại
        </button>
      </div>
    );

  return (
    <div className="designer-page">
      <button
        className="back-btn"
        onClick={() => navigate("/explore/designers")}
      >
        ← Quay lại
      </button>

      <div
        className="banner"
        style={{
          backgroundImage: `url(${safeImageUrl(
            designer.bannerUrl,
            "/assets/default-banner.jpg"
          )})`,
        }}
      >
        <div className="overlay" />
        <div className="banner-content">
          <img
            className="avatar"
            src={safeImageUrl(designer.avatarUrl, "/assets/default-avatar.png")}
            alt={designer.designerName || "avatar"}
            onError={(e) => {
              if (
                e.currentTarget.src !==
                window.location.origin + "/assets/default-avatar.png"
              ) {
                e.currentTarget.src = "/assets/default-avatar.png";
              }
            }}
          />
          <div className="info">
            <h2>
              {designer.designerName || designer.userFullName || "Nhà thiết kế"}
            </h2>
            <div className="tags">
              <span className="chip">🎨 Nhà Thiết Kế</span>
              <span className="chip-outline">
                Thành viên từ {new Date(designer.createdAt).getFullYear()}
              </span>
              <span className="rating">
                ⭐ {designer.rating?.toFixed(1) || "0"} (
                {designer.reviewCount || 0})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="left">
          <div className="card">
            <h3>🎨 Giới thiệu</h3>
            <p>
              {designer.bio?.trim() ||
                "Đam mê thời trang bền vững và thân thiện với môi trường."}
            </p>
            <div className="tags">
              <span className="tag">🌱 Bền vững</span>
              <span className="tag">🎨 Hiện đại</span>
              <span className="tag">✔️ Chất lượng</span>
            </div>
          </div>

          <div className="card">
            <h3>🌿 Chuyên môn</h3>
            <a
              className="btn"
              href={designer.specializationUrl?.trim() || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {designer.specializationUrl?.trim()
                ? "Xem chi tiết"
                : "Chưa cập nhật"}
            </a>
          </div>

          <div className="card">
            <h3>🌐 Portfolio</h3>
            <a
              className="btn"
              href={designer.portfolioUrl?.trim() || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {designer.portfolioUrl?.trim()
                ? "Xem Portfolio"
                : "Chưa cập nhật"}
            </a>
          </div>

          {isValidJsonArray(designer.portfolioFiles) ? (
            (() => {
              const files = JSON.parse(designer.portfolioFiles!);
              return (
                <div className="card">
                  <h3>🖼️ Portfolio Images</h3>
                  <div className="images">
                    {files.map((url: string, idx: number) => (
                      <img
                        key={idx}
                        src={safeImageUrl(url, "/assets/default-portfolio.jpg")}
                        alt={`portfolio-${idx}`}
                        onError={(e) => {
                          if (
                            e.currentTarget.src !==
                            window.location.origin +
                              "/assets/default-portfolio.jpg"
                          ) {
                            e.currentTarget.src =
                              "/assets/default-portfolio.jpg";
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="card">
              <h3>🖼️ Portfolio Images</h3>
              <div className="images">
                <img
                  src="/assets/default-portfolio.jpg"
                  alt="portfolio-default"
                  onError={(e) => {
                    if (
                      e.currentTarget.src !==
                      window.location.origin + "/assets/default-portfolio.jpg"
                    ) {
                      e.currentTarget.src = "/assets/default-portfolio.jpg";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {isValidJsonArray(designer.certificates) ? (
            (() => {
              const certs = JSON.parse(designer.certificates!);
              return (
                <div className="card">
                  <h3>🎖️ Chứng chỉ</h3>
                  <ul>
                    {certs.map((cert: string, idx: number) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              );
            })()
          ) : (
            <div className="card">
              <h3>🎖️ Chứng chỉ</h3>
              <div>Chưa có chứng chỉ</div>
            </div>
          )}

          {isValidJsonObject(designer.socialLinks) &&
            (() => {
              try {
                const links = JSON.parse(designer.socialLinks);
                const hasLinks =
                  links &&
                  (links.instagram?.trim() ||
                    links.behance?.trim() ||
                    links.facebook?.trim() ||
                    links.website?.trim());
                if (hasLinks) {
                  return (
                    <div className="card">
                      <h3>🔗 Mạng xã hội</h3>
                      <ul>
                        {links.instagram?.trim() && (
                          <li>
                            <a
                              href={links.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Instagram
                            </a>
                          </li>
                        )}
                        {links.behance?.trim() && (
                          <li>
                            <a
                              href={links.behance}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Behance
                            </a>
                          </li>
                        )}
                        {links.facebook?.trim() && (
                          <li>
                            <a
                              href={links.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Facebook
                            </a>
                          </li>
                        )}
                        {links.website?.trim() && (
                          <li>
                            <a
                              href={links.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Website
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                }
              } catch {}
              return null;
            })()}
        </div>

        <div className="right">
          <h3>📞 Liên hệ</h3>
          {designer.email?.trim() && <p>Email: {designer.email}</p>}
          {designer.phoneNumber?.trim() && (
            <p>Điện thoại: {designer.phoneNumber}</p>
          )}
          {designer.address?.trim() && <p>Địa chỉ: {designer.address}</p>}

          <div className="card">
            <h3>📊 Thống kê</h3>
            <p>Đánh giá: {designer.rating?.toFixed(1) || "0"}/5</p>
            <p>Lượt đánh giá: {designer.reviewCount || 0}</p>
            <p>Thành viên từ: {new Date(designer.createdAt).getFullYear()}</p>
          </div>

          {/* Thông tin bổ sung */}
          {(designer.taxNumber?.trim() ||
            designer.identificationPictureOwner?.trim()) && (
            <div className="card">
              <h3>📝 Thông tin bổ sung</h3>
              {designer.taxNumber?.trim() && (
                <p>
                  <strong>Mã số thuế:</strong> {designer.taxNumber}
                </p>
              )}
              {designer.identificationPictureOwner?.trim() && (
                <p>
                  <strong>Chủ sở hữu ảnh định danh:</strong>{" "}
                  {designer.identificationPictureOwner}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
