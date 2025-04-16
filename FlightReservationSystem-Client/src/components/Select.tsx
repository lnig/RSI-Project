import { ChevronDown, X } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

type SelectProps = { 
  options: { value: string; label: string }[]
  value: string | null
  onValueChange: (value: string) => void
  placeholder?: string
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  width?: string
  borderColor?: string
  borderColorFocusActive?: string
  backgroundColor?: string
  textColor?: string
  Icon?: React.ElementType
  noOptionsMessage?: string
  searchable?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
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
  noOptionsMessage = 'No options',
  searchable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const selectRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sizeClasses: Record<NonNullable<SelectProps['size']>, string> = {
    xs: 'px-2 py-1 text-xs h-7',
    s: 'px-2 py-1 text-sm h-8',
    m: 'px-2 py-1 text-base h-9',
    l: 'px-2 py-1 text-lg h-10',
    xl: 'px-2 py-2 text-lg h-11',
  }

  const currentBorderColor = isActive || isFocused || isOpen ? borderColorFocusActive : borderColor

  const filteredOptions = searchable && searchTerm 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ) : options;
  
  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
        setSearchTerm('')
        setShowPlaceholder(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (val: string) => {
    onValueChange(val)
    setIsOpen(false)
    setSearchTerm('')
    setIsFocused(false)
    setShowPlaceholder(true)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange('')
    setSearchTerm('')
    setShowPlaceholder(true)
    if (inputRef.current) {
      inputRef.current.focus()
    }
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setShowPlaceholder(false)
    setIsFocused(true)
  }

  return (
    <div className="relative" ref={selectRef}>
      <div
        className={`
          border rounded cursor-pointer flex justify-between items-center
          ${width} ${sizeClasses[size]}
        `}
        style={{
          borderColor: currentBorderColor,
          background: backgroundColor,
          color: textColor,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          if (!searchTerm) {
            setShowPlaceholder(true)
          }
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen && searchable) {
            inputRef.current?.focus()
          }
        }}
      >
        <div className='flex items-center w-full'>
          {Icon && (
            <div className="pointer-events-none w-fit">
              <Icon
                size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24}
                color={value ? textColor : '#8E94A0'}
                strokeWidth={1.5}
              />
            </div>
          )}
          {isOpen && searchable ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={showPlaceholder ? placeholder : ''}
              className={`bg-transparent focus:outline-none px-2 w-full placeholder:text-[#8E94A0]`}
              autoFocus
              onFocus={handleInputFocus}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false)
                  setSearchTerm('')
                  setShowPlaceholder(true)
                }
              }}
            />
          ) : (
            <div className="px-2 w-full truncate">
              {selectedOption?.label || <span className="text-[#8E94A0]">{placeholder}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {value && (
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
          <div className="cursor-pointer w-fit">
            <ChevronDown
              size={size === 'xs' ? 16 : size === 's' ? 18 : size === 'm' ? 20 : size === 'l' ? 20 : 24}
              color={value ? textColor : '#8E94A0'}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-10 mt-1 ${width} rounded border shadow-lg
            max-h-60 overflow-auto
          `}
          style={{
            background: backgroundColor,
            borderColor: borderColorFocusActive,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`
                  px-3 py-2 cursor-pointer hover:bg-gray-100
                  ${sizeClasses[size]}
                  ${value === option.value ? 'bg-gray-100' : ''}
                `}
                onClick={() => handleSelect(option.value)}
                style={{ color: textColor }}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div
              className={`px-3 py-2 ${sizeClasses[size]}`}
              style={{ color: textColor }}
            >
              {noOptionsMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Select