import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Recycling, LocalShipping, WaterDrop, Verified } from '@mui/icons-material';
import CompostIcon from '@mui/icons-material/Compost';
import { CriterionCalculationDetail } from '../../schemas/materialSchema';

interface SustainabilityScoreBreakdownProps {
  sustainabilityScore: number;
  criterionDetails: CriterionCalculationDetail[];
  carbonFootprint?: number;
  carbonFootprintUnit?: string;
  waterUsage?: number;
  waterUsageUnit?: string;
  wasteDiverted?: number;
  wasteDivertedUnit?: string;
  certificationDetails?: string;
  transportDistance?: number;
  transportMethod?: string;
}

const SustainabilityScoreBreakdown: React.FC<SustainabilityScoreBreakdownProps> = ({
  sustainabilityScore,
  criterionDetails,
  carbonFootprint,
  carbonFootprintUnit,
  waterUsage,
  waterUsageUnit,
  wasteDiverted,
  wasteDivertedUnit,
  certificationDetails,
  transportDistance,
  transportMethod,
}) => {
  // Map criterion details to display data
  const getCriterionData = (criterionName: string) => {
    const detail = criterionDetails.find(c => c.criterionName === criterionName);
    return detail || null;
  };

  const criteria = [
    {
      id: 1,
      name: 'Carbon Footprint',
      icon: <Recycling />,
      detail: getCriterionData('Carbon Footprint'),
      fallbackValue: carbonFootprint ? `${carbonFootprint} ${carbonFootprintUnit || 'kg CO2e/m²'}` : 'Chưa có dữ liệu',
      weight: '20%',
      color: '#4caf50'
    },
    {
      id: 2,
      name: 'Water Usage',
      icon: <WaterDrop />,
      detail: getCriterionData('Water Usage'),
      fallbackValue: waterUsage ? `${waterUsage} ${waterUsageUnit || 'lít/m²'}` : 'Chưa có dữ liệu',
      weight: '20%',
      color: '#2196f3'
    },
    {
      id: 3,
      name: 'Waste Diverted',
      icon: <CompostIcon />,
      detail: getCriterionData('Waste Diverted'),
      fallbackValue: wasteDiverted ? `${wasteDiverted} ${wasteDivertedUnit || '%'}` : 'Chưa có dữ liệu',
      weight: '20%',
      color: '#ff9800'
    },
    {
      id: 4,
      name: 'Organic Certification',
      icon: <Verified />,
      detail: getCriterionData('Organic Certification'),
      fallbackValue: certificationDetails ? 'Có chứng nhận' : 'Chưa có chứng nhận',
      weight: '20%',
      color: '#9c27b0'
    },
    {
      id: 5,
      name: 'Transport',
      icon: <LocalShipping />,
      detail: getCriterionData('Transport'),
      fallbackValue: transportDistance ? `${transportDistance}km (${transportMethod})` : 'Chưa có dữ liệu',
      weight: '20%',
      color: '#607d8b'
    }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        📊 Chi tiết tính điểm bền vững
      </Typography>
      
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>🎯 Điểm tổng hợp:</strong> <span style={{ color: 'green', fontWeight: 'bold', fontSize: '1.1em' }}>{sustainabilityScore.toFixed(1)}%</span>
          <br />
          <strong>📋 Công thức:</strong> Carbon (20%) + Water (20%) + Waste (20%) + Certification (20%) + Transport (20%) = 100%
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {criteria.map((criterion) => {
          const hasDetail = criterion.detail !== null;
          const score = hasDetail ? criterion.detail!.score : 0;
          const status = hasDetail ? criterion.detail!.status : 'N/A';
          const value = hasDetail ? `${criterion.detail!.actualValue} ${criterion.detail!.unit}` : criterion.fallbackValue;
          
          return (
            <Box key={criterion.id}>
              <Paper 
                sx={{ 
                  p: 2, 
                  border: `2px solid ${criterion.color}20`,
                  bgcolor: `${criterion.color}08`,
                  '&:hover': {
                    bgcolor: `${criterion.color}12`,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: criterion.color, mr: 1 }}>
                    {criterion.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {criterion.name}
                  </Typography>
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {hasDetail && (
                      <Box sx={{ 
                        bgcolor: score >= 80 ? 'green' : score >= 60 ? '#FFD700' : score >= 40 ? 'orange' : 'red', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1, 
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {score.toFixed(1)}%
                      </Box>
                    )}
                    <Box sx={{ bgcolor: criterion.color, color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem' }}>
                      {criterion.weight}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {value}
                </Typography>
                {hasDetail && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {status} • {criterion.detail!.explanation}
                  </Typography>
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>💡 Lưu ý:</strong> Điểm Transport được tính động dựa trên khoảng cách và phương thức vận chuyển. 
          Các tiêu chí khác được so sánh với chuẩn ngành để xác định điểm số.
        </Typography>
      </Box>
    </Paper>
  );
};

export default SustainabilityScoreBreakdown;
