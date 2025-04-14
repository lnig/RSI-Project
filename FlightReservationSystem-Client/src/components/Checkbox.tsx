import React from "react";
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean,             // if the checkbox is checked
  size?: number,                // size of the checkbox
  borderColor?: string,         // border color of the checkbox                
  checkedColor?: string,        // color of the check icon and border if the checkbox is checked
  backgroundColor?: string,     // background color of the checkbox  
  Icon?: React.ElementType       // icon in checkbox
  onChange: (checked: boolean) => void;  // function to call when the checkbox is clicked
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  checked = true,
  size = 24, 
  borderColor = "#dee1e6",
  checkedColor = "#EB4C60",
  Icon = Check, 
  onChange 
}) => {

  return (
    <div
      className={`flex items-center justify-center border rounded cursor-pointer transition-colors duration-200`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        borderColor: checked ? checkedColor : borderColor}}
      onClick={() => onChange(!checked)}
    >
      {checked && 
        <Icon 
          style={{
            width: `${size / 1.5}px`, 
            height: `${size / 1.5}px`
        }} 
          color={checkedColor}/>
     }
    </div>
  )
}

export default Checkbox;