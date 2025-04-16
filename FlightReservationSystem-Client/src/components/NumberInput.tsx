import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  label?: boolean;
  labelText?: string;
  size?: number;
  value?: number;
  minValue?: number;
  maxValue?: number;
  borderColor?: string;
  bgColor?: string;
  minusBgColor?: string;
  minusIconColor?: string;
  plusBgColor?: string;
  plusIconColor?: string;
  textColor?: string;
  labelColor?: string;
  textSize?: number;
  labelSize?: number;
  width?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  label = false,
  labelText = "kg",                 
  size = 32,                    
  value = 0,                   
  minValue = 0,                 
  maxValue = 999,               
  borderColor = "#dee1e6",      
  bgColor = "#ffffff",          
  minusBgColor = "#f3f4f6",     
  minusIconColor = "#565d6d",  
  plusBgColor = "#EB4C60",      
  plusIconColor = "#ffffff",    
  textColor = "#323743",      
  labelColor = "#565d6d",       
  textSize = 16,                
  labelSize = 14,             
  disabled = false,             
  onChange                      
}) => {
  const isIncreaseDisabled = value >= maxValue || disabled;
  const isDecreaseDisabled = value <= minValue || disabled;

  const decreaseValue = () => {
    const newValue = Math.max(value - 1, minValue);
    onChange(newValue);
  };

  const increaseValue = () => {
    const newValue = Math.min(value + 1, maxValue);
    onChange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === '') {
      onChange(minValue);
      return;
    }
    
    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.max(minValue, Math.min(maxValue, numericValue));
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    if (value === undefined || value === null || isNaN(value)) {
      onChange(minValue);
    }
  };

  return (
    <div 
      className="flex items-center w-full h-fit border rounded p-1 space-x-2"
      style={{
        borderColor,
        backgroundColor: bgColor
      }}
    >
      <button 
        className={`flex items-center justify-center rounded ${isDecreaseDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={decreaseValue}
        disabled={isDecreaseDisabled}
        style={{
          width: `${size}px`,
          height: `${size}px`, 
          backgroundColor: minusBgColor
        }}
      >
        <Minus size={16} color={minusIconColor}/>
      </button>
      
      <input 
        type="number" 
        value={value} 
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="text-center focus:outline-none w-[calc(100%-80px)]"
        min={minValue}
        max={maxValue}
        disabled={disabled}
        style={{
          color: textColor, 
          fontSize: `${textSize}px`, 
          backgroundColor: bgColor,
        }}
      />
      
      {label && labelText && (
        <span style={{color: labelColor, fontSize: `${labelSize}px`}}>
          {labelText}
        </span>
      )}
      
      <button 
        className={`flex items-center justify-center rounded ${isIncreaseDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={increaseValue}
        disabled={isIncreaseDisabled}
        style={{
          width: `${size}px`,
          height: `${size}px`, 
          backgroundColor: plusBgColor
        }}
      >
        <Plus size={16} color={plusIconColor}/>
      </button>
    </div>
  );
};

export default NumberInput;