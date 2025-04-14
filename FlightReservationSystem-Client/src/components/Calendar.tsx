import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  dayNames,
  monthNames,
  getDaysInMonth,
  areDatesEqual,
} from '../utils/dateUtils';
import '../App.css';

type CalendarProps = {
  baseYear: number,
  onDateSelect: (date: Date) => void,
  selectedDate: Date | null,
  currentMonthIndex: number,
  onMonthChange: (monthIndex: number) => void,
  onYearChange: (year: number) => void,
  primaryColor?: string,
  secondaryColor?: string,
  size?: 's' | 'm' | 'l';
};

const Calendar: React.FC<CalendarProps> = ({
  baseYear,
  onDateSelect,
  selectedDate,
  currentMonthIndex,
  onMonthChange,
  onYearChange,
  primaryColor = '#EB4C60',
  secondaryColor = '#FFFFFF',
  size = 'm',
}) => {
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement | null>(null);
  const yearDropdownRef = useRef<HTMLDivElement | null>(null);
  const yearListRef = useRef<HTMLDivElement | null>(null);

  const [daysInMonth, setDaysInMonth] = useState<number>(
    getDaysInMonth(currentMonthIndex, baseYear)
  );

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentMonthIndex, baseYear));

    const handleClickOutside = (e: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target as Node)) {
        setMonthDropdownOpen(false);
      }

      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [currentMonthIndex, baseYear]);

  const handlePrev = () => {
    if (currentMonthIndex === 0) {
      onMonthChange(11);
      onYearChange(baseYear - 1);
    } else {
      onMonthChange(currentMonthIndex - 1);
    }
  }

  const handleNext = () => {
    if (currentMonthIndex === 11) {
      onMonthChange(0);
      onYearChange(baseYear + 1);
    } else {
      onMonthChange(currentMonthIndex + 1);
    }
  }

  useEffect(() => { 
    if(yearDropdownOpen && yearListRef.current) {
      const index = baseYear - (currentYear - 64) + 4;
      yearListRef.current.scrollTop = 24 * index;
    }
  }, [yearDropdownOpen, baseYear]);

  let datesToRender: Date[] = [];
  const currentYear = new Date().getFullYear();

  return (
    <div className='xl:w-fit'>
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={handlePrev}
          className={`grid place-content-center cursor-pointer ${size === 's' ? 'w-5 h-5' : size === 'm' ? 'w-6 h-6' : 'w-7 h-7'} bg-[#F2F3F4] hover:bg-[#DEE1E5] rounded`}
          aria-label="Previous month"
        >
          <ChevronLeft size={size === 's' ? 14 : size === 'm' ? 16 : 18} color='#313642' />
        </button>

        <div className='flex items-center relative'>
          <div className="relative text-center w-full" ref={monthDropdownRef}>
            <p className={`px-2 min-w-14 text-base text-[#313642] cursor-pointer hover:bg-[#F2F3F4] ${monthDropdownOpen ? 'bg-[#F2F3F4]' : ''} rounded`} onClick={() => {setMonthDropdownOpen(!monthDropdownOpen); setYearDropdownOpen(false)}}>
              {monthNames[currentMonthIndex]}
            </p>

            {monthDropdownOpen && (
              <div className='absolute w-full top-6 z-10 flex flex-col bg-white border border-[#E0E0E0] rounded shadow-lg max-h-56 overflow-y-auto custom-scrollbar'>
                {monthNames.map((monthName, idx) => {
                  return (
                    <div
                      key={idx}
                      className='flex items-center rounded justify-center py-[2px] hover:bg-[#F2F3F4] cursor-pointer'
                      onClick={() => {
                        setMonthDropdownOpen(false);
                        onMonthChange(idx);
                      }}
                    >
                      <p>{monthName.slice(0,3)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative w-full " ref={yearDropdownRef}>
            <p className={`px-3 text-base text-[#313642] cursor-pointer hover:bg-[#F2F3F4] ${yearDropdownOpen ? 'bg-[#F2F3F4]' : ''} rounded`} onClick={() => {setYearDropdownOpen(!yearDropdownOpen); setMonthDropdownOpen(false)}}>
              {baseYear}
            </p>

            {yearDropdownOpen && (
              <div ref={yearListRef} className='absolute w-full top-6 z-10 flex flex-col bg-white border border-[#E0E0E0] rounded shadow-lg max-h-56 overflow-y-auto custom-scrollbar'>
                {Array.from({ length: 72 }, (_, i) => currentYear - 64 + i).map((year) => {
                  return (
                    <div
                      key={year}
                      className='flex items-center rounded justify-center py-[2px] hover:bg-[#F2F3F4] cursor-pointer'
                      onClick={() => {
                        setYearDropdownOpen(false);
                        onYearChange(year); 
                      }}
                    >
                      <p>{year}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleNext}
          className={`grid place-content-center cursor-pointer ${size === 's' ? 'w-5 h-5' : size === 'm' ? 'w-6 h-6' : 'w-7 h-7'} bg-[#F2F3F4] hover:bg-[#DEE1E5] rounded`}
          aria-label="Next month"
        >
          <ChevronRight size={size === 's' ? 14 : size === 'm' ? 16 : 18} color='#313642' />
        </button>
      </div>

      <div className={`grid grid-cols-7 ${size === 's' ? 'gap-0' : size === 'm' ? 'gap-2' : 'gap-4'}`}>
        {dayNames.map((dayName, index) => {
          const isWeekend = index === 5 || index === 6;
          return (
            <div key={index} className={`w-full flex justify-center items-center ${size === 's' ? 'mb-1' : 'mb-0'}`}>
              <p className={`font-semibold text-xs text-center ${isWeekend ? 'text-[#EB4C60]' : 'text-[#8E94A0]'}`}>
                {dayName.slice(0, 1)}
              </p>
            </div>
          );
        })}

        {(() => {
          const firstDayOfMonth = new Date(baseYear, currentMonthIndex, 1).getDay();
          const blanks = (firstDayOfMonth + 6) % 7;
          let prevMonthIndex = 0;
          let prevMonthYear = 0;
          let nextMonthIndex = 0;
          let nextMonthYear = 0;

          if (currentMonthIndex === 0) {
            prevMonthIndex = 11;
            prevMonthYear = baseYear - 1;
          } else {
            prevMonthIndex = currentMonthIndex - 1;
          }     

          if (currentMonthIndex === 11) {
            nextMonthIndex = 0;
            nextMonthYear = baseYear + 1;
          } else {
            nextMonthIndex = currentMonthIndex + 1;
          }
      
          const daysInPrevMonth = getDaysInMonth(prevMonthIndex, prevMonthYear);

          const prevMonthDays = Array.from({ length: blanks }, (_, idx) => {
            return new Date(prevMonthYear, prevMonthIndex, daysInPrevMonth - blanks + idx + 1);
          });

          const currentMonthDays = Array.from({ length: daysInMonth }, (_, dayIdx) => {
            return new Date(baseYear, currentMonthIndex, dayIdx + 1);
          });

          const totalDays = prevMonthDays.length + currentMonthDays.length;
          const weeks = Math.ceil(totalDays / 7);

          const remainingDays = weeks * 7 - totalDays;
          const nextMonthDays = Array.from({ length: remainingDays }, (_, idx) => {
            return new Date(nextMonthYear, nextMonthIndex, idx + 1);
          });

          datesToRender = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

          return datesToRender.map((currentDate, idx) => {
            const dayNumber = currentDate.getDate();
            const isSelected = areDatesEqual(currentDate, selectedDate);
            const isCurrentMonth = currentDate.getMonth() === currentMonthIndex && currentDate.getFullYear() === baseYear;
            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <div key={idx} className={`relative w-full flex flex-col justify-center items-center ${size === 's' ? 'py-[3px]' : 'py-0'}`}
                   style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor } as React.CSSProperties}>
                <p
                  className={`flex items-center justify-center text-base focus:outline-none
                    ${isSelected && isCurrentMonth ? 'w-6 h-6 -my-0.5' : 'w-8 h-8 -my-1'}
                    ${isCurrentMonth ? 'cursor-pointer' : 'cursor-not-allowed'}
                    ${isSelected && isCurrentMonth
                      ? 'rounded-full bg-[color:var(--primary-color)] text-[color:var(--secondary-color)]'
                      : isCurrentMonth
                      ? 'bg-transparent]'
                      : 'text-[#BDC0C9] bg-transparent'}
                    ${isCurrentMonth && isWeekend ? 'font-semibold text-[#EB4C60]' : ''}`}
                  onClick={() => isCurrentMonth && onDateSelect(currentDate)}
                  aria-disabled={!isCurrentMonth}
                  aria-label={`${isSelected ? 'Selected ' : ''}${dayNames[(currentDate.getDay() + 6) % 7]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                >
                  {dayNumber}
                </p>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default Calendar;
