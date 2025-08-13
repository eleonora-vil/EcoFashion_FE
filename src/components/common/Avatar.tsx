import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackText?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'User', 
  size = 'md', 
  fallbackText = 'U',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`rounded-full bg-brand-500 flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src && !imageError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="font-medium text-white">
          {fallbackText}
        </span>
      )}
    </div>
  );
};

export default Avatar; 