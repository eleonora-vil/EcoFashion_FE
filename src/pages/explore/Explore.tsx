import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import OwlCarousel from "react-owl-carousel";
import NavbarOne from "../../components/navbar/navbar-one";
import "../../assets/css/stylist.css";

// Import icons
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";


const mockCategories = [
  {
    id: 1,
    title: "Thời Trang Bền Vững",
    description: "Khám phá các thiết kế thân thiện với môi trường",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    count: "500+ sản phẩm"
  },
  {
    id: 2,
    title: "Vật Liệu Tái Chế",
    description: "Nguyên liệu chất lượng cao từ vật liệu tái chế",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
    count: "200+ loại"
  },
  {
    id: 3,
    title: "Thiết Kế Độc Đáo",
    description: "Sáng tạo từ các nhà thiết kế tài năng",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
    count: "300+ nhà thiết kế"
  }
];

const mockProducts = [
  {
    id: 1,
    title: "Áo Sơ Mi Linen Tái Chế",
    designer: "EcoDesign Studio",
    price: "450.000₫",
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    badge: "Bán chạy",
    isFavorite: false
  },
  {
    id: 2,
    title: "Túi Xách Canvas Tái Chế",
    designer: "Green Fashion",
    price: "680.000₫",
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    badge: "Mới",
    isFavorite: true
  },
  {
    id: 3,
    title: "Váy Đầm Cotton Hữu Cơ",
    designer: "Sustainable Style",
    price: "890.000₫",
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    badge: "Giảm giá",
    isFavorite: false
  },
  {
    id: 4,
    title: "Quần Jeans Tái Chế",
    designer: "Eco Denim",
    price: "750.000₫",
    rating: 4.6,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    badge: "Phổ biến",
    isFavorite: false
  },
  {
    id: 5,
    title: "Áo Khoác Denim Tái Chế",
    designer: "Recycled Fashion",
    price: "1.200.000₫",
    rating: 4.9,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    badge: "Bán chạy",
    isFavorite: true
  },
  {
    id: 6,
    title: "Áo Len Hữu Cơ",
    designer: "Organic Knits",
    price: "550.000₫",
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    badge: "Mới",
    isFavorite: false
  }
];

const mockRecentlyViewed = [
  {
    id: 1,
    title: "Áo Sơ Mi Linen",
    price: "450.000₫",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=160&fit=crop"
  },
  {
    id: 2,
    title: "Túi Xách Canvas",
    price: "680.000₫",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=160&fit=crop"
  },
  {
    id: 3,
    title: "Váy Đầm Cotton",
    price: "890.000₫",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=160&fit=crop"
  },
  {
    id: 4,
    title: "Quần Jeans",
    price: "750.000₫",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=160&fit=crop"
  }
];

function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<OwlCarousel | null>(null);

  useEffect(() => {
    AOS.init();
  }, []);

  const goToPrevSlide = () => {
    if (carouselRef.current) {
      carouselRef.current?.prev(300);
    }
  };

  const goToNextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current?.next(300);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate search
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        className="rating-stars"
        style={{ 
          fontSize: '16px',
          color: i < Math.floor(rating) ? '#ffc107' : '#e0e0e0'
        }} 
      />
    ));
  };

  return (
    <>
      <NavbarOne />
      <div className="explore-main">
        <div className="explore-container">
          {/* Header Section */}
          <div className="explore-header">
            <div className="explore-header-content">
              <h1 className="explore-title">Khám Phá Thời Trang Bền Vững</h1>
              <p className="explore-subtitle">
                Tìm kiếm những sản phẩm thân thiện với môi trường từ các nhà thiết kế tài năng
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="explore-search-section">
            <form onSubmit={handleSearch} className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm, nhà thiết kế hoặc vật liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <SearchIcon style={{ fontSize: '20px' }} />
                Tìm kiếm
              </button>
            </form>
            
            <div className="filter-buttons">
              <button 
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Tất cả
              </button>
              <button 
                className={`filter-button ${activeFilter === 'fashion' ? 'active' : ''}`}
                onClick={() => setActiveFilter('fashion')}
              >
                Thời trang
              </button>
              <button 
                className={`filter-button ${activeFilter === 'materials' ? 'active' : ''}`}
                onClick={() => setActiveFilter('materials')}
              >
                Vật liệu
              </button>
              <button 
                className={`filter-button ${activeFilter === 'designers' ? 'active' : ''}`}
                onClick={() => setActiveFilter('designers')}
              >
                Nhà thiết kế
              </button>
            </div>
          </div>

          {/* Featured Categories Section */}
          <div className="featured-categories">
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <div className="categories-grid">
              {mockCategories.map((category) => (
                <div key={category.id} className="category-card">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="category-image"
                  />
                  <div className="category-content">
                    <h3 className="category-title">{category.title}</h3>
                    <p className="category-description">{category.description}</p>
                    <button className="category-button">
                      Khám phá {category.count}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="products-section">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <div className="products-grid">
              {mockProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {product.badge && (
                      <div className="product-badge">{product.badge}</div>
                    )}
                    <button 
                      className="product-favorite"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favorites.includes(product.id) ? (
                        <FavoriteIcon style={{ color: '#e74c3c', fontSize: '18px' }} />
                      ) : (
                        <FavoriteBorderIcon style={{ color: '#666', fontSize: '18px' }} />
                      )}
                    </button>
                  </div>
                  <div className="product-content">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-designer">Bởi {product.designer}</p>
                    <div className="product-rating">
                      {renderStars(product.rating)}
                      <span className="rating-count">({product.reviewCount})</span>
                    </div>
                    <p className="product-price">{product.price}</p>
                    <div className="product-actions">
                      <button className="add-to-cart-btn">
                        <ShoppingCartIcon style={{ fontSize: '16px', marginRight: '4px' }} />
                        Thêm vào giỏ
                      </button>
                      <button className="quick-view-btn">
                        <VisibilityIcon style={{ fontSize: '16px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed Section */}
          <div className="recently-viewed">
            <h2 className="section-title">Đã Xem Gần Đây</h2>
            <div className="carousel-container">
              <button className="carousel-nav prev" onClick={goToPrevSlide}>
                <ArrowBackIcon />
              </button>
              <div className="recently-viewed-grid">
                {mockRecentlyViewed.map((product) => (
                  <div key={product.id} className="recent-product-card">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="recent-product-image"
                    />
                    <div className="recent-product-content">
                      <h4 className="recent-product-title">{product.title}</h4>
                      <p className="recent-product-price">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-nav next" onClick={goToNextSlide}>
                <ArrowForwardIcon />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton-card loading-skeleton" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Explore;
