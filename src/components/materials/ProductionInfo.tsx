import React from "react";
import { Box, Typography, Chip, Tooltip } from "@mui/material";
import { LocationOn, Factory, Engineering } from "@mui/icons-material";

interface ProductionInfoProps {
  country?: string;
  region?: string;
  process?: string;
  showDescription?: boolean;
}

const ProductionInfo: React.FC<ProductionInfoProps> = ({ 
  country, 
  region, 
  process, 
  showDescription = true 
}) => {
  const getCountryFlag = (country: string) => {
    // Simple country code mapping
    const countryCodes: { [key: string]: string } = {
      'Vietnam': '🇻🇳',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Turkey': '🇹🇷',
      'Bangladesh': '🇧🇩',
      'Pakistan': '🇵🇰',
      'Indonesia': '🇮🇩',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Philippines': '🇵🇭',
      'Myanmar': '🇲🇲',
      'Cambodia': '🇰🇭',
      'Laos': '🇱🇦',
      'Singapore': '🇸🇬',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Taiwan': '🇹🇼',
      'United States': '🇺🇸',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Egypt': '🇪🇬',
      'Morocco': '🇲🇦',
      'Tunisia': '🇹🇳',
      'Ethiopia': '🇪🇹',
      'Kenya': '🇰🇪',
      'Uganda': '🇺🇬',
      'Tanzania': '🇹🇿',
      'Madagascar': '🇲🇬',
      'Mauritius': '🇲🇺',
      'South Africa': '🇿🇦',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿'
    };
    
    return countryCodes[country] || '🌍';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Country and Region */}
      {(country || region) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <LocationOn color="primary" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {country && (
              <>
                <Typography variant="body2" fontWeight="medium">
                  {getCountryFlag(country)} {country}
                </Typography>
                {region && (
                  <Typography variant="body2" color="text.secondary">
                    ({region})
                  </Typography>
                )}
              </>
            )}
            {!country && region && (
              <Typography variant="body2" fontWeight="medium">
                {region}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      
      {/* Manufacturing Process */}
      {process && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Engineering color="info" sx={{ mt: 0.2 }} />
          <Box>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
              Quy trình sản xuất
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {process}
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Production Type Indicator */}
      {country && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="Sản xuất"
            size="small"
            color="success"
            variant="outlined"
            icon={<Factory />}
          />
          {country !== 'Vietnam' && (
            <Chip 
              label="Nhập khẩu"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      )}
      
      {showDescription && (country || region) && (
        <Tooltip title="Thông tin về nguồn gốc sản xuất">
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block',
              fontStyle: 'italic',
              mt: 0.5
            }}
          >
            {country === 'Vietnam' 
              ? 'Sản xuất trong nước - Giảm thiểu carbon footprint'
              : `Sản xuất tại ${country} - Có thể ảnh hưởng đến sustainability score`
            }
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default ProductionInfo; 