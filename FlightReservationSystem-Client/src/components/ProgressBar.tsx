import React from 'react';

interface ProgressBarProps {
  value: number,            // value of the progress bar (0-100)
  size: number,             // height of the progress bar (max 16px)
  foreground?: string,      // color of the filled part of the progress bar
  background?: string,      // color of the empty part of the progress bar
  divided?: boolean,        // whether to show divisions inside the filled part of the progress bar
  dividedSteps?: number,    // number of divisions inside the filled part of the progress bar
  messageBubble?: boolean,  // whether to show a message bubble with the current value
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  size = 8,
  foreground = "#EB4C60",
  background = "#e5e7eb",
  divided = false,
  dividedSteps = 10,
  messageBubble = false,
}) => {
  if (size > 16) size = 16;
  if (size < 4) size = 4;
  
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className='text-center w-full relative py-9'>

      {/* Dymek z procentem */}
      {messageBubble && (
        <div className='absolute top-0 text-xs -translate-x-1/2 px-3 py-1 rounded-lg font-semibold whitespace-nowrap pointer-events-none' 
        style={{
          left: `${clampedValue}%`,
          backgroundColor: foreground,
          color: background,
          zIndex: 2,
        }}
        >
          {clampedValue}%
          <div className='absolute -bottom-[6px] left-1/2 -translate-x-1/2' 
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${foreground}`,
              }} 
          />
        </div>
      )}

      {/* Pasek postępu */}
      <div className='w-full rounded-full overflow-hidden relative' 
           style={{
             height: `${size}px`,
             backgroundColor: background
           }}
      >
        <div className='h-full relative' 
          style={{
            width: `${clampedValue}%`,
            backgroundColor: foreground,
            transition: 'width 0.3s ease-in-out'
          }}
        />

        {/* Podziały odnoszące się do całego paska */}
        {divided && dividedSteps > 1 && (
          <div className='absolute top-0 left-0 h-full w-full flex justify-between pointer-events-none'>
            {Array.from({ length: dividedSteps + 1 }).map((_, index) => (
              <div key={index} className='h-full w-[1px] bg-white opacity-50'/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
