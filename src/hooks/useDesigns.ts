// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import type { Design } from "../services/api/designService";
// import { DesignService } from "../services/api/designService";
// export interface UseDesignDetailReturn {
//   designDetail: Design[] | null;
//   loading: boolean;
//   saving: boolean;
//   error: string | null;
// //   updateDesignDetail: (data: Partial<Design>) => Promise<void>;
//   refreshDesignDetail: () => Promise<void>;
// }

// export const useDesigns = (): UseDesignDetailReturn => {
//   const [designDetail, setDesignDetail] = useState<Design[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadDesignDetail= async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const designDetail= await DesignService.getDesignById();
//       setDesignDetail(designDetail);
//     } catch (error: any) {
//       const errorMessage = error.message || "Không thể tải thông tin design";
//       setError(errorMessage);
//       console.error("Error loading design profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshDesignDetail = async () => {
//     await loadDesignDetail();
//   };

//   // Load profile khi component mount
//   useEffect(() => {
//     loadDesignDetail();
//   }, []);

//   return {
//     designDetail,
//     loading,
//     saving,
//     error,
//     refreshDesignDetail,
//   };
// };
