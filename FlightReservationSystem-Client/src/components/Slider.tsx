import React, { useState, useCallback, useRef, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
  onChange?: (values: [number, number]) => void;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  defaultValue = [min, max],
  onChange,
  className = '',
}) => {
  const [actualMin, actualMax] = min > max ? [max, min] : [min, max];
  
  const initialValues = [
    Math.max(actualMin, Math.min(actualMax, defaultValue[0])),
    Math.max(actualMin, Math.min(actualMax, defaultValue[1]))
  ].sort((a, b) => a - b) as [number, number];

  const [values, setValues] = useState<[number, number]>(initialValues);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = useCallback(
    (value: number) => {
      const percentage = ((value - actualMin) / (actualMax - actualMin)) * 100;
      return Math.min(100, Math.max(0, percentage));
    },
    [actualMin, actualMax]
  );

  const valueFromPosition = useCallback(
    (position: number) => {
      if (!sliderRef.current) return actualMin;
      
      const sliderWidth = sliderRef.current.offsetWidth;
      const percentage = (position / sliderWidth) * 100;
      const rawValue = actualMin + (percentage / 100) * (actualMax - actualMin);
      const steppedValue = Math.round((rawValue - actualMin) / step) * step + actualMin;
      return Math.min(actualMax, Math.max(actualMin, steppedValue));
    },
    [actualMin, actualMax, step]
  );

  const handleMouseDown = (thumb: 'min' | 'max') => {
    setActiveThumb(thumb);
    document.body.style.userSelect = 'none';
  };

  const handleMouseUp = useCallback(() => {
    setActiveThumb(null);
    document.body.style.userSelect = '';
  }, []);

  const updateValues = useCallback(
    (newValue: number) => {
      if (activeThumb === 'min') {
        const minValue = Math.min(Math.max(newValue, actualMin), values[1] - step);
        const newValues = [minValue, values[1]] as [number, number];
        setValues(newValues);
        onChange?.(newValues);
      } else if (activeThumb === 'max') {
        const maxValue = Math.max(Math.min(newValue, actualMax), values[0] + step);
        const newValues = [values[0], maxValue] as [number, number];
        setValues(newValues);
        onChange?.(newValues);
      }
    },
    [activeThumb, onChange, values, step, actualMin, actualMax]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!activeThumb || !sliderRef.current) return;
      
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(sliderRect.width, clientX - sliderRect.left)); // Ograniczenie pozycji
      const newValue = valueFromPosition(position);
      updateValues(newValue);
    },
    [activeThumb, valueFromPosition, updateValues]
  );

  const handleInputChange = (type: 'min' | 'max', e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) return;

    if (type === 'min') {
      const minValue = Math.min(Math.max(newValue, actualMin), values[1] - step);
      const newValues = [minValue, values[1]] as [number, number];
      setValues(newValues);
      onChange?.(newValues);
    } else {
      const maxValue = Math.min(Math.max(newValue, values[0] + step), actualMax);
      const newValues = [values[0], maxValue] as [number, number];
      setValues(newValues);
      onChange?.(newValues);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    if (activeThumb) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [activeThumb, handleMove, handleMouseUp]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(sliderRect.width, e.clientX - sliderRect.left)); // Ograniczenie pozycji
    const clickValue = valueFromPosition(position);

    const [minValue, maxValue] = values;
    const isCloserToMin = Math.abs(clickValue - minValue) < Math.abs(clickValue - maxValue);
    
    if (isCloserToMin && clickValue <= maxValue - step) {
      updateValues(clickValue);
      setActiveThumb('min');
    } else if (!isCloserToMin && clickValue >= minValue + step) {
      updateValues(clickValue);
      setActiveThumb('max');
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="mb-4 px-1">
        <div
          ref={sliderRef}
          className="h-2 bg-[#DEE1E5] rounded-full cursor-pointer relative"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-2 bg-[#EA4B60] rounded-full"
            style={{
              left: `${getPercentage(values[0])}%`,
              right: `${100 - getPercentage(values[1])}%`,
            }}
          />
        </div>

        <div
          className="absolute top-1 w-4 h-4 bg-white border-2 border-[#EA4B60] rounded-full cursor-pointer shadow-lg hover:scale-110 -translate-y-1/2"
          style={{ 
            left: `${getPercentage(values[0])}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={() => handleMouseDown('min')}
          onTouchStart={() => handleMouseDown('min')}
        />

        <div
          className="absolute top-1 w-4 h-4 bg-white border-2 border-[#EA4B60] rounded-full cursor-pointer shadow-lg hover:scale-110 -translate-y-1/2"
          style={{ 
            left: `${getPercentage(values[1])}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={() => handleMouseDown('max')}
          onTouchStart={() => handleMouseDown('max')}
        />
      </div>

      <div className="flex justify-between mt-4">
        <input
          type="number"
          min={actualMin}
          max={values[1] - step}
          step={step}
          value={values[0]}
          onChange={(e) => handleInputChange('min', e)}
          className="w-20 px-2 py-1 border border-[#DEE1E5] rounded focus:outline-none focus:border-[#8E94A0]"
        />
        <input
          type="number"
          min={values[0] + step}
          max={actualMax}
          step={step}
          value={values[1]}
          onChange={(e) => handleInputChange('max', e)}
          className="w-20 px-2 py-1 border border-[#DEE1E5] rounded focus:outline-none focus:border-[#8E94A0]"
        />
      </div>
    </div>
  );
};

export default RangeSlider;