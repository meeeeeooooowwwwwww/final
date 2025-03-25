interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#007bff',
  className = ''
}: LoadingSpinnerProps) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{ 
        width: sizeMap[size],
        height: sizeMap[size],
        borderColor: `${color}20`,
        borderTopColor: color
      }}
      role="progressbar"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner; 