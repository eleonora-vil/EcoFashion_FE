import type { Product } from "../types/Product";

export const products: Product[] = [
  {
    id: 1,
    name: "Áo thun Organic Cotton",
    category: "clothing",
    brand: "EcoWear",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop",
    ],
    sustainability: {
      materials: ["Organic Cotton"],
      carbonFootprint: "very-low",
      waterUsage: "low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 8,
      certifications: ["GOTS", "Fair Trade"],
    },
    price: {
      current: 450000,
      original: 550000,
      currency: "VND",
    },
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Trắng", "Đen", "Xanh Navy", "Xám"],
    availability: "in-stock",
    rating: {
      average: 4.5,
      count: 127,
    },
    description:
      "Áo thun làm từ 100% cotton hữu cơ, thoáng mát và thân thiện với môi trường. Thiết kế minimalist phù hợp với mọi phong cách.",
    features: [
      "100% Cotton hữu cơ",
      "Thoáng khí",
      "Co giãn nhẹ",
      "Dễ chăm sóc",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    discountPercentage: 18,
  },
  {
    id: 2,
    name: "Quần Jeans Recycled Denim",
    category: "clothing",
    brand: "GreenDenim",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549037616-30e6d84cb986?w=400&h=500&fit=crop",
    ],
    sustainability: {
      materials: ["Recycled Denim", "Organic Cotton"],
      carbonFootprint: "low",
      waterUsage: "very-low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 9,
      certifications: ["Cradle to Cradle", "B-Corp"],
    },
    price: {
      current: 890000,
      currency: "VND",
    },
    sizes: ["28", "29", "30", "31", "32", "33", "34", "36"],
    colors: ["Xanh đậm", "Xanh nhạt", "Đen"],
    availability: "in-stock",
    rating: {
      average: 4.7,
      count: 89,
    },
    description:
      "Quần jeans làm từ vải denim tái chế, giảm 70% lượng nước sử dụng so với quy trình sản xuất truyền thống.",
    features: [
      "80% Denim tái chế",
      "Tiết kiệm nước",
      "Bền chắc",
      "Thiết kế classic",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    id: 3,
    name: "Túi Canvas Tái Chế",
    category: "bags",
    brand: "EcoBags Co.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=400&h=500&fit=crop",
    ],
    sustainability: {
      materials: ["Recycled Canvas", "Organic Cotton"],
      carbonFootprint: "very-low",
      waterUsage: "low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 7,
      certifications: ["Fair Trade"],
    },
    price: {
      current: 320000,
      original: 400000,
      currency: "VND",
    },
    colors: ["Trắng kem", "Xanh lá", "Nâu đất"],
    availability: "in-stock",
    rating: {
      average: 4.3,
      count: 56,
    },
    description:
      "Túi canvas thân thiện môi trường, chịu lực tốt và có thể tái sử dụng nhiều lần.",
    features: [
      "100% Canvas tái chế",
      "Chống thấm nước nhẹ",
      "Quai đeo chắc chắn",
      "Đa năng",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    discountPercentage: 20,
  },
  {
    id: 4,
    name: "Giày Sneaker Eco-Friendly",
    category: "footwear",
    brand: "GreenStep",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop",
    ],
    sustainability: {
      materials: ["Recycled Plastic", "Organic Hemp", "Natural Rubber"],
      carbonFootprint: "low",
      waterUsage: "low",
      ethicalManufacturing: true,
      recyclable: false,
      durabilityRating: 8,
      certifications: ["B-Corp"],
    },
    price: {
      current: 1250000,
      currency: "VND",
    },
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    colors: ["Trắng", "Đen", "Xám"],
    availability: "limited",
    rating: {
      average: 4.6,
      count: 34,
    },
    description:
      "Giày sneaker thời trang làm từ chai nhựa tái chế và sợi hemp hữu cơ, êm ái và bền bỉ.",
    features: [
      "Chai nhựa tái chế",
      "Đế cao su tự nhiên",
      "Thoáng khí",
      "Thiết kế hiện đại",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 5,
    name: "Váy Maxi Linen Organic",
    category: "clothing",
    brand: "Natural Elegance",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    sustainability: {
      materials: ["Organic Linen"],
      carbonFootprint: "very-low",
      waterUsage: "very-low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 7,
      certifications: ["GOTS", "Fair Trade"],
    },
    price: {
      current: 780000,
      original: 950000,
      currency: "VND",
    },
    sizes: ["S", "M", "L", "XL"],
    colors: ["Trắng", "Be", "Xanh pastel"],
    availability: "in-stock",
    rating: {
      average: 4.4,
      count: 67,
    },
    description:
      "Váy maxi từ sợi lanh hữu cơ, mềm mại và thoáng mát, hoàn hảo cho mùa hè.",
    features: [
      "100% Linen hữu cơ",
      "Thoáng mát",
      "Không nhăn",
      "Phong cách bohemian",
    ],
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    discountPercentage: 18,
  },
  {
    id: 6,
    name: "Kính Mát Bamboo Frame",
    category: "accessories",
    brand: "BambooEye",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop",
    sustainability: {
      materials: ["Bamboo", "Recycled Plastic Lenses"],
      carbonFootprint: "very-low",
      waterUsage: "very-low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 6,
      certifications: ["FSC"],
    },
    price: {
      current: 450000,
      currency: "VND",
    },
    colors: ["Nâu tre", "Đen tre"],
    availability: "in-stock",
    rating: {
      average: 4.2,
      count: 23,
    },
    description:
      "Kính mát với gọng tre tự nhiên, nhẹ và bền, bảo vệ mắt khỏi tia UV.",
    features: [
      "Gọng tre tự nhiên",
      "Chống UV 100%",
      "Siêu nhẹ",
      "Thiết kế unisex",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
  },
  {
    id: 7,
    name: "Áo Hoodie Recycled Cotton",
    category: "clothing",
    brand: "WarmGreen",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    sustainability: {
      materials: ["Recycled Cotton", "Organic Cotton"],
      carbonFootprint: "low",
      waterUsage: "low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 8,
      certifications: ["GRS", "OEKO-TEX"],
    },
    price: {
      current: 690000,
      original: 820000,
      currency: "VND",
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Xám", "Đen", "Xanh navy", "Đỏ đô"],
    availability: "in-stock",
    rating: {
      average: 4.5,
      count: 98,
    },
    description:
      "Áo hoodie ấm áp từ cotton tái chế, phù hợp cho thời tiết mát mẻ.",
    features: [
      "70% Cotton tái chế",
      "Lót fleece ấm",
      "Túi kanga tiện lợi",
      "Dây rút điều chỉnh",
    ],
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    discountPercentage: 16,
  },
  {
    id: 8,
    name: "Tất Bamboo Fiber",
    category: "accessories",
    brand: "ComfortFeet",
    image:
      "https://images.unsplash.com/photo-1586681250971-cb9e24e98d87?w=400&h=500&fit=crop",
    sustainability: {
      materials: ["Bamboo Fiber", "Organic Cotton"],
      carbonFootprint: "very-low",
      waterUsage: "very-low",
      ethicalManufacturing: true,
      recyclable: true,
      durabilityRating: 7,
      certifications: ["OEKO-TEX"],
    },
    price: {
      current: 120000,
      currency: "VND",
    },
    sizes: ["35-38", "39-42", "43-46"],
    colors: ["Trắng", "Đen", "Xám", "Nâu"],
    availability: "in-stock",
    rating: {
      average: 4.3,
      count: 156,
    },
    description: "Tất từ sợi tre tự nhiên, kháng khuẩn và thấm hút mồ hôi tốt.",
    features: ["Sợi tre tự nhiên", "Kháng khuẩn", "Thấm hút tốt", "Mềm mại"],
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
  },
];

// Demo filter functions (similar to materials)
export const filterProducts = {
  byCategory: (products: Product[], categories: Product["category"][]) => {
    if (categories.length === 0) return products;
    return products.filter((product) => categories.includes(product.category));
  },

  byPriceRange: (products: Product[], min: number, max: number) => {
    return products.filter(
      (product) => product.price.current >= min && product.price.current <= max
    );
  },

  byAvailability: (
    products: Product[],
    availability: Product["availability"][]
  ) => {
    if (availability.length === 0) return products;
    return products.filter((product) =>
      availability.includes(product.availability)
    );
  },

  byBrand: (products: Product[], brands: string[]) => {
    if (brands.length === 0) return products;
    return products.filter((product) => brands.includes(product.brand));
  },

  bySustainability: (
    products: Product[],
    criteria: {
      carbonFootprint?: Product["sustainability"]["carbonFootprint"][];
      ethicalManufacturing?: boolean;
      recyclable?: boolean;
      minDurabilityRating?: number;
    }
  ) => {
    return products.filter((product) => {
      if (criteria.carbonFootprint && criteria.carbonFootprint.length > 0) {
        if (
          !criteria.carbonFootprint.includes(
            product.sustainability.carbonFootprint
          )
        ) {
          return false;
        }
      }
      if (criteria.ethicalManufacturing !== undefined) {
        if (
          product.sustainability.ethicalManufacturing !==
          criteria.ethicalManufacturing
        ) {
          return false;
        }
      }
      if (criteria.recyclable !== undefined) {
        if (product.sustainability.recyclable !== criteria.recyclable) {
          return false;
        }
      }
      if (criteria.minDurabilityRating !== undefined) {
        if (
          product.sustainability.durabilityRating < criteria.minDurabilityRating
        ) {
          return false;
        }
      }
      return true;
    });
  },

  byRating: (products: Product[], minRating: number) => {
    return products.filter((product) => product.rating.average >= minRating);
  },
};

// Demo search function
export const searchProducts = (products: Product[], query: string) => {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase().trim();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.sustainability.materials.some((material) =>
        material.toLowerCase().includes(searchTerm)
      )
  );
};

// Demo sorting functions
export const sortProducts = {
  byName: (products: Product[], direction: "asc" | "desc" = "asc") => {
    return [...products].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return direction === "asc" ? comparison : -comparison;
    });
  },

  byPrice: (products: Product[], direction: "asc" | "desc" = "asc") => {
    return [...products].sort((a, b) => {
      const comparison = a.price.current - b.price.current;
      return direction === "asc" ? comparison : -comparison;
    });
  },

  byRating: (products: Product[], direction: "asc" | "desc" = "desc") => {
    return [...products].sort((a, b) => {
      const comparison = a.rating.average - b.rating.average;
      return direction === "asc" ? comparison : -comparison;
    });
  },

  byNewest: (products: Product[]) => {
    return [...products].sort((a, b) => {
      // Prioritize new products first, then by ID (assuming higher ID = newer)
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return b.id - a.id;
    });
  },

  bySustainability: (
    products: Product[],
    direction: "asc" | "desc" = "desc"
  ) => {
    return [...products].sort((a, b) => {
      // Simple sustainability score based on multiple factors
      const scoreA = calculateSustainabilityScore(a.sustainability);
      const scoreB = calculateSustainabilityScore(b.sustainability);
      const comparison = scoreA - scoreB;
      return direction === "asc" ? comparison : -comparison;
    });
  },
};

// Helper function to calculate sustainability score
function calculateSustainabilityScore(
  sustainability: Product["sustainability"]
): number {
  let score = 0;

  // Carbon footprint score (lower is better)
  const carbonScores = {
    "very-low": 5,
    low: 4,
    medium: 3,
    high: 2,
    negative: 1,
  };
  score += carbonScores[sustainability.carbonFootprint] * 2;

  // Water usage score (lower is better)
  const waterScores = { "very-low": 4, low: 3, medium: 2, high: 1 };
  score += waterScores[sustainability.waterUsage] * 1.5;

  // Ethical manufacturing
  if (sustainability.ethicalManufacturing) score += 3;

  // Recyclable
  if (sustainability.recyclable) score += 2;

  // Durability rating
  score += sustainability.durabilityRating * 0.5;

  // Certifications bonus
  if (sustainability.certifications) {
    score += sustainability.certifications.length * 0.5;
  }

  return score;
}

// Get featured products
export const getFeaturedProducts = (limit: number = 4) => {
  return products.filter((product) => product.isFeatured).slice(0, limit);
};

// Get best seller products
export const getBestSellerProducts = (limit: number = 4) => {
  return products.filter((product) => product.isBestSeller).slice(0, limit);
};

// Get new products
export const getNewProducts = (limit: number = 4) => {
  return products.filter((product) => product.isNew).slice(0, limit);
};

// Get products with discount
export const getDiscountedProducts = (limit?: number) => {
  const discounted = products.filter(
    (product) => product.discountPercentage && product.discountPercentage > 0
  );
  return limit ? discounted.slice(0, limit) : discounted;
};
