import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface IntegrityMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function IntegrityMeter({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: IntegrityMeterProps) {
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm': return { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-lg' };
      case 'lg': return { width: 180, height: 180, strokeWidth: 12, fontSize: 'text-4xl' };
      default: return { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-2xl' };
    }
  }, [size]);

  const { width, height, strokeWidth, fontSize } = dimensions;
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'hsl(160, 84%, 39%)'; // Emerald
    if (score >= 60) return 'hsl(38, 92%, 50%)'; // Warning
    return 'hsl(0, 84%, 60%)'; // Danger
  };

  const getStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Fair';
    return 'At Risk';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`font-bold ${fontSize}`}
            style={{ color }}
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Score
            </span>
          )}
        </div>
      </div>
      
      {showLabel && (
        <motion.div 
          className="text-center"
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span 
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: `${color}20`,
              color 
            }}
          >
            {getStatus(score)}
          </span>
        </motion.div>
      )}
    </div>
  );
}
