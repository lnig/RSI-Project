import React, { useState, useEffect } from 'react';

interface ButtonProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  type?: 'primary' | 'secondary' | 'tertiary' | 'icon';
  btnType?: 'button' | 'submit' | 'reset';
  primaryColor?: string;
  secondaryColor?: string;
  hoverPrimaryColor?: string;
  hoverSecondaryColor?: string;
  width?: string;
  text?: string;
  Icon?: React.ElementType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  size = 'm',
  type = 'primary',
  btnType = 'button',
  primaryColor = '#EB4C60',
  secondaryColor = '#FFFFFF',
  hoverPrimaryColor = '#d94354',
  hoverSecondaryColor = '#f3f3f3',
  width = 'w-fit',
  text,
  Icon,
  onClick,
  disabled = false,
}) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    xs: 'px-3 text-xs h-7',
    s: 'px-3 text-xs h-8',
    m: 'px-4 text-sm h-9',
    l: 'px-5 text-base h-11',
    xl: 'px-6 text-lg h-12',
  };

  const iconSizeMapping: Record<NonNullable<ButtonProps['size']>, { height: string, width: string, iconSize: number }> = {
    xs: { height: 'h-7', width: 'w-7', iconSize: type === 'icon' ? 14 : 12 },
    s: { height: 'h-8', width: 'w-8', iconSize: type === 'icon' ? 16 : 14 },
    m: { height: 'h-9', width: 'w-9', iconSize: type === 'icon' ? 18 : 16 },
    l: { height: 'h-11', width: 'w-11', iconSize: type === 'icon' ? 20 : 18 },
    xl: { height: 'h-12', width: 'w-12', iconSize: type === 'icon' ? 24 : 22 },
  };

  const getBaseStyle = (): React.CSSProperties => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          color: secondaryColor,
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          border: `1px solid ${primaryColor}`,
          color: primaryColor,
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          color: primaryColor,
          textDecoration: 'underline',
          border: 'none',
        };
      case 'icon':
        return {
          backgroundColor: 'transparent',
          color: primaryColor,
          padding: '0',
          border: 'none',
        };
      default:
        return {
          backgroundColor: primaryColor,
          color: secondaryColor,
          border: 'none',
        };
    }
  };

  const handleMouseEnter = () => {
    const hoverStyle: React.CSSProperties = { ...getBaseStyle() };

    switch (type) {
      case 'primary':
        hoverStyle.backgroundColor = hoverPrimaryColor;
        hoverStyle.color = hoverSecondaryColor;
        break;
      case 'secondary':
        hoverStyle.color = hoverPrimaryColor;
        hoverStyle.borderColor = hoverPrimaryColor;
        break;
      case 'tertiary':
        case 'icon':
        hoverStyle.color = hoverPrimaryColor;
        break;
    }

    setStyle(hoverStyle);
  };

  const handleMouseLeave = () => {
    setStyle(getBaseStyle());
  };

  useEffect(() => {
    setStyle(getBaseStyle());
  }, [primaryColor, secondaryColor, type]);

  const baseClasses = type === 'icon'
    ? `rounded flex items-center justify-center cursor-pointer ${iconSizeMapping[size].height} ${iconSizeMapping[size].width} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`
    : `rounded flex items-center justify-center cursor-pointer gap-2 ${width} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`;

  const renderContent = () => {
    if (Icon && text) {
      return (
        <>
          <Icon size={iconSizeMapping[size].iconSize} />
          {text}
        </>
      );
    } else if (Icon) {
      return <Icon size={iconSizeMapping[size].iconSize} />;
    } else {
      return text;
    }
  };

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type={btnType}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderContent()}
    </button>
  );
};

export default Button;