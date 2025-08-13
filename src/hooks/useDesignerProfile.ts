// Custom hook for managing designer profile
import { useState, useEffect } from "react";
import { DesignerService } from "../services/api";
import type { DesignerProfile } from "../services/api";
import { toast } from "react-toastify";

export interface UseDesignerProfileReturn {
  profile: DesignerProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateProfile: (data: Partial<DesignerProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useDesignerProfile = (): UseDesignerProfileReturn => {
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const designerProfile = await DesignerService.getDesignerProfile();
      setProfile(designerProfile);
    } catch (error: any) {
      const errorMessage = error.message || "Không thể tải thông tin profile";
      setError(errorMessage);
      console.error("Error loading designer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<DesignerProfile>) => {
    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await DesignerService.updateDesignerProfile(data);
      setProfile(updatedProfile);
      toast.success("Cập nhật profile thành công!");
    } catch (error: any) {
      const errorMessage = error.message || "Lỗi khi cập nhật profile";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
      throw error; // Re-throw để component có thể handle
    } finally {
      setSaving(false);
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  // Load profile khi component mount
  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    refreshProfile,
  };
};
