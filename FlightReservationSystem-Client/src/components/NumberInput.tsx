import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  label?: boolean,              // if the input has label
  labelText?: string,           // labelText next to input eg. kg, pt
  size?: number,                // size of plus, minus button
  value?: number,               // value in input
  minValue?: number,            // minimal value user can enter
  maxValue?: number,            // maximal value user can enter
  borderColor?: string,         // border color of whole component
  bgColor?: string,             // background color of component
  minusBgColor?: string,        // background color of minus button
  minusIconColor?: string,      // color of icon on minus button
  plusBgColor?: string,         // background color of plus button
  plusIconColor?: string,       // color of icon on plus button
  textColor?: string,           // text color on input
  labelColor?: string,          // color of labelText
  textSize?: number,            // size of text in input
  labelSize?: number,           // size of labelText 
  disabled?: boolean,           // if the button is disabled
  onChange: (value: number) => void     // function onChange
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
  const width = (maxValue.toString().length - 1) * 32;

  const isIncreaseValueDisabled = value < maxValue;
  const isDecreaseValueDisabled = value > minValue;

  const decreaseValue = () => {
    const newValue = Math.max(value - 1, minValue);
    onChange(newValue);
  };

  const increaseValue = () => {
    const newValue = Math.min(value + 1, maxValue);
    onChange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? '' : Math.max(minValue, Math.min(maxValue, parseInt(event.target.value) || 0));
    if (newValue === '') {
        onChange(0);
    } else {
        onChange(Number(newValue));
    }
  };

  const handleBlur = () => {
    if (value === undefined || value === null || isNaN(value)) {
        onChange(0);
    }
  };

return (
  <div className="flex items-center w-fit h-fit border rounded p-1 space-x-2" 
    style={{
      borderColor: borderColor, 
      background: bgColor
    }}>
    <button 
      className={`flex items-center justify-center rounded ${isDecreaseValueDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={decreaseValue}
      disabled={value <= minValue || disabled}
      style={{
        width: `${size}px`,
        height: `${size}px`, 
        background: minusBgColor
      }}
    >
      <Minus size={16} color={minusIconColor}/>
    </button>
    <input 
      type="number" 
      value={value} 
      onChange={handleInputChange}
      onBlur={handleBlur}
      className="text-center focus:outline-none"
      max={maxValue}
      disabled={disabled}
      style={{
        color: textColor, 
        fontSize: textSize, 
        background: bgColor,
        width: `${width}px`
      }}
    />
    {label && labelText && (
      <>
        <p style={{color: labelColor, fontSize: labelSize}}>{labelText}</p>
      </>
    )}
    <button 
      className={`flex items-center justify-center rounded ${isIncreaseValueDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={increaseValue}
      disabled={value >= maxValue || disabled}
      style={{
        width: `${size}px`,
        height: `${size}px`, 
        background: plusBgColor
      }}
    >
      <Plus size={16} color={plusIconColor}/>
    </button>
  </div>
  );
};

export default NumberInput;
