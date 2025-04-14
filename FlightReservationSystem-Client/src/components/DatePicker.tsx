import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import Calendar from './Calendar';

type DatePickerProps = {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl',
  width?: string,
  borderColor?: string,
  borderColorFocusActive?: string,
  backgroundColor?: string,
  textColor?: string,
  primaryColor?: string,
  Icon?: React.ElementType,
  selectedDate: Date | null,
  currentMonthIndex: number,
  baseYear: number,
  onDateSelect: (date: Date) => void,
  onMonthChange: (monthIndex: number) => void,
  onYearChange: (year: number) => void,
  placeholder?: string
};

const DatePicker: React.FC<DatePickerProps> = ({
  size = 'm',
  width = 'w-64',
  borderColor = '#DEE1E5',
  borderColorFocusActive = '#BDC0C9',
  backgroundColor = '#FFFFFF',
  textColor = '#313642',
  primaryColor = '#EB4C60',
  Icon,
  selectedDate,
  currentMonthIndex,
  baseYear,
  onDateSelect,
  onMonthChange,
  onYearChange,
  placeholder = 'Select date'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sizeClasses: Record<NonNullable<DatePickerProps['size']>, string> = {
    xs: 'px-2 py-1 text-xs h-7',
    s: 'px-2 py-1 text-sm h-8',
    m: 'px-2 py-1 text-base h-9',
    l: 'px-2 py-1 text-lg h-10',
    xl: 'px-2 py-2 text-lg h-11',
  };

  const currentBorderColor = isActive || isFocused ? borderColorFocusActive : borderColor;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit" ref={wrapperRef}>
      <div
        className={`
          border rounded cursor-pointer flex justify-between items-center
          ${width} ${sizeClasses[size]}
          placeholder:text-[#8E94A0]
        `}
        style={{
          borderColor: currentBorderColor,
          background: backgroundColor,
          color: textColor,
        }}
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
      >
        <div className='flex items-center w-full'>
          {Icon && (
            <div className="pointer-events-none w-fit">
              <Icon
                size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24}
                color={selectedDate ? textColor : '#8E94A0'}
                strokeWidth={1.5}
              />
            </div>
          )}
          <div className="px-2 w-full truncate">
            {selectedDate ? selectedDate.toLocaleDateString() : placeholder}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {selectedDate && (
            <div 
              className="cursor-pointer w-fit hover:bg-gray-100 rounded"
              onClick={handleClear}
            >
              <X
                size={size === 'xs' ? 14 : size === 's' ? 16 : size === 'm' ? 18 : size === 'l' ? 20 : 22}
                color="#8E94A0"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 p-4 mt-1 z-10 bg-white rounded shadow-sm border"
          style={{ 
            borderColor: borderColorFocusActive,
            backgroundColor: backgroundColor
          }}
        >
          <Calendar 
            baseYear={baseYear}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            currentMonthIndex={currentMonthIndex}
            onMonthChange={onMonthChange}
            onYearChange={onYearChange}  
            size="s"
            primaryColor={primaryColor}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;