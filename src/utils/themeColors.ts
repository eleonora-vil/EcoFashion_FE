// EcoFashion Theme Colors
// Màu sắc được thiết kế để dễ đọc và phù hợp với theme bền vững

export const SUSTAINABILITY_COLORS = {
  // Sustainability Score Colors
  EXCELLENT: "#4CAF50",    // Green - Xuất sắc (80%+)
  GOOD: "#FFD700",         // Golden Yellow - Tốt (60-79%) - dễ đọc hơn
  FAIR: "#FF9800",         // Orange - Trung bình (40-59%)
  POOR: "#F44336",         // Red - Cần cải thiện (<40%)
  
  // Alternative colors for better contrast
  GOOD_ALT: "#FFC107",     // Amber - Alternative cho Good
  FAIR_ALT: "#FF8F00",     // Dark Orange - Alternative cho Fair
  
  // Eco-friendly colors
  ECO_GREEN: "#66BB6A",    // Light Green
  ECO_BLUE: "#42A5F5",     // Blue
  ECO_TEAL: "#26A69A",     // Teal
  ECO_LIME: "#CDDC39",     // Lime
  ECO_AMBER: "#FFC107",    // Amber
};

export const TRANSPORT_COLORS = {
  SEA: "#2196F3",          // Blue - Sea transport (best)
  RAIL: "#4CAF50",         // Green - Rail transport (good)
  LAND: "#FF9800",         // Orange - Land transport (medium)
  AIR: "#F44336",          // Red - Air transport (worst)
};

export const MATERIAL_TYPE_COLORS = {
  NATURAL: "#8BC34A",      // Light Green
  SYNTHETIC: "#FF9800",    // Orange
  RECYCLED: "#4CAF50",     // Green
  ORGANIC: "#66BB6A",      // Light Green
  BLEND: "#FFC107",        // Amber
};

export const STATUS_COLORS = {
  PENDING: "#FF9800",      // Orange
  APPROVED: "#4CAF50",     // Green
  REJECTED: "#F44336",     // Red
  DRAFT: "#9E9E9E",        // Grey
};

// Helper function để lấy màu sustainability dựa trên score
export const getSustainabilityColor = (score: number): string => {
  if (score >= 80) return SUSTAINABILITY_COLORS.EXCELLENT;
  if (score >= 60) return SUSTAINABILITY_COLORS.GOOD;
  if (score >= 40) return SUSTAINABILITY_COLORS.FAIR;
  return SUSTAINABILITY_COLORS.POOR;
};

// Helper function để lấy màu transport dựa trên method
export const getTransportColor = (method: string): string => {
  const methodLower = method?.toLowerCase();
  switch (methodLower) {
    case 'sea': return TRANSPORT_COLORS.SEA;
    case 'rail': return TRANSPORT_COLORS.RAIL;
    case 'land': return TRANSPORT_COLORS.LAND;
    case 'air': return TRANSPORT_COLORS.AIR;
    default: return TRANSPORT_COLORS.LAND;
  }
};

// Helper function để lấy màu material type
export const getMaterialTypeColor = (type: string): string => {
  const typeLower = type?.toLowerCase();
  if (typeLower?.includes('natural')) return MATERIAL_TYPE_COLORS.NATURAL;
  if (typeLower?.includes('synthetic')) return MATERIAL_TYPE_COLORS.SYNTHETIC;
  if (typeLower?.includes('recycled')) return MATERIAL_TYPE_COLORS.RECYCLED;
  if (typeLower?.includes('organic')) return MATERIAL_TYPE_COLORS.ORGANIC;
  if (typeLower?.includes('blend')) return MATERIAL_TYPE_COLORS.BLEND;
  return MATERIAL_TYPE_COLORS.NATURAL;
}; 