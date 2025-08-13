import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { materialService } from "../../services/api/materialService";
import { getSustainabilityColor } from "../../utils/themeColors";

interface SustainabilityToolbarProps {
  sustainabilityScore: number;
  sustainabilityLevel?: string;
  sustainabilityColor?: string;
  showDetails?: boolean;
}

interface SustainabilityEvaluation {
  score: number;
  level: string;
  color: string;
  description: string;
  recommendation: string;
  category: string;
  isExcellent: boolean;
  isGood: boolean;
  isFair: boolean;
  isPoor: boolean;
}

const SustainabilityToolbar: React.FC<SustainabilityToolbarProps> = ({
  sustainabilityScore,
  sustainabilityLevel,
  sustainabilityColor,
  showDetails = true,
}) => {
  const [evaluation, setEvaluation] = useState<SustainabilityEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        const data = await materialService.getSustainabilityEvaluation(sustainabilityScore);
        setEvaluation(data);
      } catch (err) {
        setError('Không thể tải thông tin đánh giá');
        console.error('Failed to fetch sustainability evaluation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [sustainabilityScore]);

  // Fallback functions if API fails - sử dụng theme colors
  const getScoreColor = (score: number) => {
    return getSustainabilityColor(score);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Xuất sắc";
    if (score >= 60) return "Tốt";
    if (score >= 40) return "Trung bình";
    return "Cần cải thiện";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Đạt chuẩn bền vững cao nhất";
    if (score >= 60) return "Đạt chuẩn bền vững tốt";
    if (score >= 40) return "Cần cải thiện thêm";
    return "Cần cải thiện đáng kể";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CircularProgress size={16} />
        <Typography variant="body2">Đang tải đánh giá bền vững...</Typography>
      </Box>
    );
  }

  // Use API data when available, fallback to hardcoded logic
  const scoreColor = evaluation?.color || sustainabilityColor || getScoreColor(sustainabilityScore);
  const scoreLabel = evaluation?.level || sustainabilityLevel || getScoreLabel(sustainabilityScore);
  const scoreDescription = evaluation?.description || getScoreDescription(sustainabilityScore);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Main Score Display */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="h6" component="span" fontWeight="bold" sx={{ mr: 1 }}>
          Điểm bền vững: {sustainabilityScore.toFixed(1)}%
        </Typography>
        <Tooltip title="Điểm tổng hợp từ 5 tiêu chí bền vững: Carbon Footprint, Water Usage, Waste Diverted, Organic Certification, Transport">
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Progress Bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={sustainabilityScore}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: scoreColor,
                borderRadius: 6,
              },
            }}
          />
        </Box>
        <Chip
          label={scoreLabel}
          size="small"
          sx={{
            backgroundColor: scoreColor,
            color: "white",
            fontWeight: "bold",
          }}
        />
      </Box>
      
      {/* Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {scoreDescription}
      </Typography>
      
      {/* Caption */}
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontStyle: "italic" }}>
        * Điểm tổng hợp từ 5 tiêu chí: Carbon Footprint, Water Usage, Waste Diverted, Organic Certification, Transport
      </Typography>

      {/* Optional Details */}
      {showDetails && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            📊 Thông tin về điểm bền vững:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">
              • <strong>Điểm bền vững:</strong> {sustainabilityScore.toFixed(1)}% - Tổng hợp từ 5 tiêu chí: Carbon Footprint, Water Usage, Waste Diverted, Organic Certification, Transport
            </Typography>
            <Typography variant="body2">
              • <strong>Mỗi tiêu chí:</strong> Đóng góp 20% vào điểm tổng hợp
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SustainabilityToolbar; 