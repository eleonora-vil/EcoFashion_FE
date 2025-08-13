export interface Product {
  id: number;
  name: string;
  category: "clothing" | "accessories" | "footwear" | "bags" | "home";
  brand: string;
  image: string;
  images?: string[]; // Additional images for gallery
  sustainability: {
    materials: string[]; // e.g., ["Organic Cotton", "Recycled Polyester"]
    carbonFootprint: "very-low" | "low" | "medium" | "high" | "negative";
    waterUsage: "very-low" | "low" | "medium" | "high";
    ethicalManufacturing: boolean;
    recyclable: boolean;
    durabilityRating: number; // 1-10 scale
    certifications?: string[]; // e.g., ["GOTS", "Fair Trade", "B-Corp"]
  };
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  sizes?: string[]; // e.g., ["XS", "S", "M", "L", "XL"]
  colors?: string[]; // e.g., ["Black", "White", "Navy"]
  availability: "in-stock" | "limited" | "pre-order" | "out-of-stock";
  rating: {
    average: number; // 1-5 scale
    count: number;
  };
  description: string;
  features?: string[]; // Key product features
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  discountPercentage?: number;
}

export interface ProductFilter {
  category?: Product["category"][];
  priceRange?: {
    min: number;
    max: number;
  };
  sustainability?: {
    carbonFootprint?: Product["sustainability"]["carbonFootprint"][];
    waterUsage?: Product["sustainability"]["waterUsage"][];
    ethicalManufacturing?: boolean;
    recyclable?: boolean;
    minDurabilityRating?: number;
  };
  availability?: Product["availability"][];
  rating?: {
    min: number;
  };
  brands?: string[];
  sizes?: string[];
  colors?: string[];
}

export interface ProductSort {
  field: "name" | "price" | "rating" | "newest" | "sustainability";
  direction: "asc" | "desc";
}
