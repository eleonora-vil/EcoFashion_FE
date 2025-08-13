export interface Fashion {
  id: number;
  name: string;
  category: "clothing" | "accessories" | "footwear" | "bags" | "home";
  brand:  {
    id: number;
    name: string;
  };
  image: string;
  images?: string[]; // Additional images for gallery
  sustainability: number;
  materials: {
    name: string;
    percentageUse: number;
  }[];
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  sizes?: string[]; // e.g., ["XS", "S", "M", "L", "XL"]
  colors?: string[]; // e.g., ["Black", "White", "Navy"]
  availability: "in-stock" | "limited" | "out-of-stock";
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
  category?: Fashion["category"][];
  priceRange?: {
    min: number;
    max: number;
  };
//   sustainability?: {
//     carbonFootprint?: Fashion["sustainability"]["carbonFootprint"][];
//     waterUsage?: Fashion["sustainability"]["waterUsage"][];
//     ethicalManufacturing?: boolean;
//     recyclable?: boolean;
//     minDurabilityRating?: number;
//   };
  availability?: Fashion["availability"][];
  rating?: {
    min: number;
  };
  brands?: string[];
  sizes?: string[];
  colors?: string[];
}

export interface FashionSort {
  field: "name" | "price" | "rating" | "newest" | "sustainability";
  direction: "asc" | "desc";
}
