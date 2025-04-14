import React, { useState, useRef } from 'react';
import '../App.css';

type TextareaProps = {
  value: string | null
  onValueChange: (value: string) => void
  placeholder?: string
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  width?: string
  borderColor?: string
  borderColorFocusActive?: string
  backgroundColor?: string
  textColor?: string
  minH?: string
  maxH?: string
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onValueChange,
  placeholder,
  width = 'w-64',
  borderColor = '#DEE1E5',
  borderColorFocusActive = '#BDC0C9',
  backgroundColor = '#FFFFFF',
  textColor = '#313642',
  minH = '10vh',
  maxH = '20vh'
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentBorderColor = isActive || isFocused ? borderColorFocusActive : borderColor

  return (
    <div
      className={`border rounded cursor-pointer ${width} placeholder:text-[#8E94A0] overflow-y-auto custom-scrollbar`}
      style={{
        borderColor: currentBorderColor,
        background: backgroundColor,
        color: textColor,
        minHeight: minH,
        maxHeight: maxH
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onClick={() => textareaRef.current && textareaRef.current.focus()}
    >
      <div className="h-full w-full">
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent focus:outline-none px-2 mt-1 w-full resize-none overflow-y-auto custom-scrollbar"
          style={{ minHeight: minH, maxHeight: maxH }}
        />
      </div>
    </div>
  )
}

export default Textarea
