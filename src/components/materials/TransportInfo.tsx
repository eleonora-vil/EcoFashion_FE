import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Tooltip, CircularProgress } from "@mui/material";
import { LocalShipping, DirectionsBoat, Train, Flight } from "@mui/icons-material";
import { materialService } from "../../services/api/materialService";

interface TransportInfoProps {
  distance: number;
  method: string;
  showDescription?: boolean;
}

interface TransportEvaluation {
  distance: number;
  method: string;
  distanceCategory: string;
  methodColor: string;
  methodDescription: string;
  sustainabilityImpact: string;
  icon: string;
  isRecommended: boolean;
}

const TransportInfo: React.FC<TransportInfoProps> = ({ 
  distance, 
  method, 
  showDescription = true 
}) => {
  const [evaluation, setEvaluation] = useState<TransportEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        const data = await materialService.getTransportEvaluation(distance, method);
        setEvaluation(data);
      } catch (err) {
        setError('Không thể tải thông tin đánh giá');
        console.error('Failed to fetch transport evaluation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [distance, method]);

  const getTransportIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'sea':
        return <DirectionsBoat color="primary" />;
      case 'land':
        return <LocalShipping color="success" />;
      case 'rail':
        return <Train color="info" />;
      case 'air':
        return <Flight color="warning" />;
      default:
        return <LocalShipping color="action" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2">Đang tải đánh giá...</Typography>
      </Box>
    );
  }

  if (error || !evaluation) {
    // Fallback to hardcoded logic if API fails
    const getTransportColor = (method: string) => {
      switch (method?.toLowerCase()) {
        case 'sea': return 'primary';
        case 'land': return 'success';
        case 'rail': return 'info';
        case 'air': return 'warning';
        default: return 'default';
      }
    };

    const getTransportDescription = (method: string) => {
      switch (method?.toLowerCase()) {
        case 'sea': return 'Vận chuyển bằng tàu biển - Ít carbon nhất';
        case 'land': return 'Vận chuyển bằng xe tải - Phù hợp cho khoảng cách ngắn';
        case 'rail': return 'Vận chuyển bằng tàu hỏa - Hiệu quả cao';
        case 'air': return 'Vận chuyển bằng máy bay - Nhanh nhất nhưng nhiều carbon';
        default: return 'Phương thức vận chuyển không xác định';
      }
    };

    const getDistanceCategory = (distance: number) => {
      if (distance <= 500) return 'Gần';
      if (distance <= 2000) return 'Trung bình';
      if (distance <= 5000) return 'Xa';
      return 'Rất xa';
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getTransportIcon(method)}
          <Typography variant="body2" fontWeight="medium">
            {method}
          </Typography>
        </Box>
        
        <Chip 
          label={`${distance.toLocaleString('vi-VN')} km`}
          size="small"
          color={getTransportColor(method) as any}
          variant="outlined"
        />
        
        <Chip 
          label={getDistanceCategory(distance)}
          size="small"
          color="default"
          variant="outlined"
        />
        
        {showDescription && (
          <Tooltip title={getTransportDescription(method)}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                fontStyle: 'italic',
                mt: 0.5
              }}
            >
              {getTransportDescription(method)}
            </Typography>
          </Tooltip>
        )}
      </Box>
    );
  }

  // Use API data when available
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {getTransportIcon(evaluation.method)}
        <Typography variant="body2" fontWeight="medium">
          {evaluation.method}
        </Typography>
      </Box>
      
      <Chip 
        label={`${evaluation.distance.toLocaleString('vi-VN')} km`}
        size="small"
        color={evaluation.methodColor as any}
        variant="outlined"
      />
      
      <Chip 
        label={evaluation.distanceCategory}
        size="small"
        color="default"
        variant="outlined"
      />
      
      {evaluation.isRecommended && (
        <Chip 
          label="Được đề xuất"
          size="small"
          color="success"
          variant="outlined"
        />
      )}
      
      {showDescription && (
        <Tooltip title={evaluation.methodDescription}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block',
              fontStyle: 'italic',
              mt: 0.5
            }}
          >
            {evaluation.methodDescription}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default TransportInfo; 