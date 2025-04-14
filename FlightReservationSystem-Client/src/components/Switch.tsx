import React from 'react';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  primaryColor?: string;
  disabled?: boolean;
};

const sizeClasses = {
  xs: { width: 'w-10', height: 'h-5', knob: 'w-4 h-4', translate: 'translate-x-[18px]' },
  s: { width: 'w-12', height: 'h-6', knob: 'w-5 h-5', translate: 'translate-x-[22px]' },
  m: { width: 'w-14', height: 'h-7', knob: 'w-6 h-6', translate: 'translate-x-[26px]' },
  l: { width: 'w-16', height: 'h-8', knob: 'w-7 h-7', translate: 'translate-x-[30px]' },
  xl: { width: 'w-20', height: 'h-10', knob: 'w-9 h-9', translate: 'translate-x-[38px]' },
};

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  size = 'm',
  primaryColor = '#EB4C60',
  disabled = false,
}) => {
  const currentSize = sizeClasses[size];
  const bgColor = value && !disabled ? primaryColor : value && disabled ? '#F9C7CD' : '#DEE1E5';
  const cursor = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <div className="flex items-center gap-6">
      <div
        className={`${currentSize.width} ${currentSize.height} flex items-center rounded-full px-1 transition-colors duration-300 ${cursor}`}
        style={{ backgroundColor: bgColor }}
        onClick={() => !disabled && onValueChange(!value)}
      >
        <div className={`bg-white ${currentSize.knob} rounded-full shadow-md transform transition-transform duration-300 ${value ? currentSize.translate : '-translate-x-[2px]'}`} />
      </div>
    </div>
  );
};

export default Switch;
