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

interface SustainabilityCompactProps {
  sustainabilityScore: number;
  sustainabilityLevel?: string;
  sustainabilityColor?: string;
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

const SustainabilityCompact: React.FC<SustainabilityCompactProps> = ({
  sustainabilityScore,
  sustainabilityLevel,
  sustainabilityColor,
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <CircularProgress size={12} />
        <Typography variant="caption">Đang tải...</Typography>
      </Box>
    );
  }

  // Use API data when available, fallback to hardcoded logic
  const scoreColor = evaluation?.color || sustainabilityColor || getScoreColor(sustainabilityScore);
  const scoreLabel = evaluation?.level || sustainabilityLevel || getScoreLabel(sustainabilityScore);

  return (
    <Box sx={{ mb: 1 }}>
      {/* Compact Score Display */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Điểm bền vững: {sustainabilityScore.toFixed(1)}%
        </Typography>
        <Tooltip title="Điểm tổng hợp từ 5 tiêu chí bền vững">
          <IconButton size="small" sx={{ color: "text.secondary", p: 0 }}>
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Compact Progress Bar */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={sustainabilityScore}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: scoreColor,
                borderRadius: 4,
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
            fontSize: "0.7rem",
            height: 20,
          }}
        />
      </Box>
      
      {/* Compact Info */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Điểm tổng hợp từ 5 tiêu chí bền vững
        </Typography>
      </Box>
    </Box>
  );
};

export default SustainabilityCompact; 