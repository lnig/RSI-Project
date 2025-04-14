import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

type TimePickerProps = {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl',     // size of the input
  borderColor?: string,
  borderColorFocusActive?: string,
  backgroundColor?: string,
  textColor?: string,
  Icon?: React.ElementType,
  value: Date,
  onValueChange: (date: Date) => void,
  placeholder?: string
};

const TimePicker: React.FC<TimePickerProps> = ({
  size = 'm',
  borderColor = '#DEE1E5',
  borderColorFocusActive = '#BDC0C9',
  backgroundColor = '#FFFFFF',
  textColor = '#313642',
  Icon,
  value,
  onValueChange,
  placeholder
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(value.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(value.getMinutes());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sizeClasses: Record<NonNullable<TimePickerProps['size']>, string> = {
    xs: 'px-2 py-1 text-xs h-7',
    s: 'px-3 py-1 text-sm h-8',
    m: 'px-3 py-1 text-base h-9',
    l: 'px-3 py-1 text-lg h-10',
    xl: 'px-3 py-2 text-lg h-11'
  };

  const currentBorderColor = isActive || isFocused ? borderColorFocusActive : borderColor;

  const incHour = () => {
    setSelectedHour((prev) => (prev + 1) % 24);
  };

  const decHour = () => {
    setSelectedHour((prev) => (prev - 1 + 24) % 24);
  };

  const incMinute = () => {
    setSelectedMinute((prev) => (prev + 1) % 60);
  };

  const decMinute = () => {
    setSelectedMinute((prev) => (prev - 1 + 60) % 60);
  };

  const handleHourWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      incHour();
    } else if (e.deltaY > 0) {
      decHour();
    }
  };

  const handleMinuteWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      incMinute();
    } else if (e.deltaY > 0) {
      decMinute();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedHour(value.getHours());
    setSelectedMinute(value.getMinutes());
  }, [value]);

  useEffect(() => {
    if (isClicked) {
      const newDate = new Date(value);
      newDate.setHours(selectedHour);
      newDate.setMinutes(selectedMinute);
      onValueChange(newDate);
    }
  }, [selectedHour, selectedMinute, isClicked]);

  useEffect(() => {
    const container = wrapperRef.current;
    if (container) {
      const wheelHandler = (e: WheelEvent) => {
        if (isOpen && container.contains(e.target as Node)) {
          e.preventDefault();
        }
      };
      container.addEventListener('wheel', wheelHandler, { passive: false });
      return () => container.removeEventListener('wheel', wheelHandler);
    }
  }, [isOpen]);

  const formattedTime = isClicked
    ? `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
    : '';

  return (
    <div className="relative w-fit" ref={wrapperRef}>
      <div>
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <Icon size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24} color={isClicked ? textColor : '#8E94A0'} strokeWidth={1.5} />
          </div>
        )}
        <input
          type="text"
          readOnly
          value={formattedTime}
          placeholder={placeholder}
          onClick={() => { setIsOpen(!isOpen); setIsClicked(true); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          className={`w-64 border rounded cursor-pointer focus:outline-none placeholder:text-[#8E94A0] ${Icon && (size === 'xs' ? 'pl-7' : size === 's' ? 'pl-8 pb-[5px]' : size === 'm' ? 'pl-9 pb-[6px]' : size === 'l' ? 'pl-9' : 'pl-10')} ${sizeClasses[size]} ${!Icon && 'pl-3'}`}
          style={{ borderColor: currentBorderColor, background: backgroundColor, color: textColor }}
        />
      </div>
      {isOpen && (
        <div className="absolute left-0 p-4 w-64 mt-2 z-10 bg-white rounded shadow-sm border" style={{ border: borderColor }}>
          <div className="flex items-center">
            <div className="w-1/2 flex flex-col items-center justify-center pr-1" onWheel={handleHourWheel}>
              <button 
                onClick={decHour} 
                className="cursor-pointer"
              >
                <ChevronUp size={20} color='#313642'/>  
              </button>
              <p className="py-[6px] pl-[1px] text-center text-lg text-[#313642]">{selectedHour.toString().padStart(2, '0')}</p>
              <button 
                onClick={incHour} 
                className="cursor-pointer"
              >
                <ChevronDown size={20} color='#313642'/>  
              </button>
            </div>

            <p className='text-2xl pb-[6px]'>:</p>

            <div className="w-1/2 flex flex-col items-center pl-1" onWheel={handleMinuteWheel}>
              <button 
                onClick={decMinute} 
                className="cursor-pointer"
              >
                <ChevronUp size={20} color='#313642'/>  
              </button>
              <p className="py-[6px] pr-[1px] text-center text-lg text-[#313642]">{selectedMinute.toString().padStart(2, '0')}</p>
              <button 
                onClick={incMinute} 
                className="cursor-pointer"
              >
                <ChevronDown size={20} color='#313642'/>  
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
