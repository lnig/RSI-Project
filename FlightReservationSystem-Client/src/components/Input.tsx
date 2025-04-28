import { Eye } from 'lucide-react'
import React, { useState, useRef } from 'react'

type InputProps = { 
  type?: 'text' | 'password' | 'number'
  value: string | number | null
  onValueChange: (value: string | number) => void
  placeholder?: string
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  width?: string
  borderColor?: string
  borderColorFocusActive?: string
  backgroundColor?: string
  textColor?: string
  Icon?: React.ElementType
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onValueChange,
  placeholder,
  size = 'm',
  width = 'w-64',
  borderColor = '#DEE1E5',
  borderColorFocusActive = '#BDC0C9',
  backgroundColor = '#FFFFFF',
  textColor = '#313642',
  Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeClasses: Record<NonNullable<InputProps['size']>, string> = {
    xs: 'px-2 py-1 text-xs h-7',
    s: 'px-2 py-1 text-sm h-8',
    m: 'px-2 py-1 text-base h-9',
    l: 'px-2 py-1 text-lg h-10',
    xl: 'px-2 py-2 text-lg h-11',
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    if (type === 'number') {
      if (newValue === '') {
        onValueChange('')
      } else if (/^[0-9]*\.?[0-9]*$/.test(newValue)) {
        const numValue = newValue.includes('.') ? parseFloat(newValue) : parseInt(newValue)
        onValueChange(isNaN(numValue) ? '' : numValue)
      }
    } else {
      onValueChange(newValue)
    }
  }

  const displayValue = value === null ? '' : value.toString()
  const currentBorderColor = isActive || isFocused ? borderColorFocusActive : borderColor
  
  return (
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
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      <div className='flex items-center'>
        {Icon && (
          <div className="pointer-events-none w-fit">
            <Icon
              size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24}
              color={value ? textColor : '#8E94A0'}
              strokeWidth={1.5}
            />
          </div>
        )}
        <input
          ref={inputRef}
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          className="bg-transparent focus:outline-none px-2 w-full"
          inputMode={type === 'number' ? 'numeric' : 'text'}
          pattern={type === 'number' ? '[0-9]*' : undefined}
        />
      </div>
      {type === 'password' && (
        <div className="cursor-pointer w-fit" onClick={() => setShowPassword((prev) => !prev)}>
          <Eye
            size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24}
            color={value ? textColor : '#8E94A0'}
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  )
}

export default Input