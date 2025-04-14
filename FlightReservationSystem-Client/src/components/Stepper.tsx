import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Check, MoreHorizontal } from 'lucide-react';

interface StepperProps {
  steps: string[],               // steps to show - max 7 steps
  currentStep: number,           // current step of steps
  size?: number,                 // size of step circle in px
  textSize?: number,             // size of text next to step in px
  primaryColor?: string,         // color of icon/border previous steps/step fill
  bgColor?: string,              // color of bg in previous/next steps
  nextStepsBorderColor?: string, // color of next steps border color
  nextStepsStepColor?: string,   // color of next steps text number color  
  textColor?: string,            // color of text next to step
  textColorInStep?: string,      // color of the text in current step
  spacing?: number,              // spacing between step and text 
  gap?: number,                  // gap between arrow
  Icon: React.ElementType        // icon in step
}

const Stepper: React.FC<StepperProps> = ({ 
  currentStep,
  steps,
  size = 20,
  textSize = 14,
  primaryColor = "#EB4C60",
  bgColor = "#ffffff",
  nextStepsBorderColor = "#bdc1ca",
  nextStepsStepColor = "#565d6d",
  textColor = "#323743",
  textColorInStep = "#ffffff",
  spacing = 8,
  gap = 16,
  Icon = Check 
}) => {
  if (steps.length > 7) steps.length = 7;
  if (currentStep < 1) currentStep = 1;
  if (currentStep > 7) currentStep = 7;

  currentStep -= 1;

  const [breakpoint, setBreakpoint] = useState('default'); 
  const containerRef = useRef(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('default');
  };

  updateBreakpoint();
  window.addEventListener('resize', updateBreakpoint);

  return () => {
    window.removeEventListener('resize', updateBreakpoint);
  };
  }, []);

  const getVisibleSteps = () => {
    switch (breakpoint) {
      case '2xl':
        return steps;
      case 'xl':
        return currentStep === 0
          ? steps.slice(0, 5)
          : currentStep === steps.length - 1
          ? steps.slice(-5)
          : steps.slice(Math.max(0, currentStep - 3), currentStep + 4);
      case 'lg':
        return currentStep === 0
          ? steps.slice(0, 4)
          : currentStep === steps.length - 1
          ? steps.slice(-4)
          : steps.slice(Math.max(0, currentStep - 2), currentStep + 3);
      case 'md':
        return currentStep === 0
          ? steps.slice(0, 3)
          : currentStep === steps.length - 1
          ? steps.slice(-3)
          : steps.slice(Math.max(0, currentStep - 1), currentStep + 2);
      case 'sm':
        return currentStep === 0
          ? steps.slice(0, 2)
          : currentStep === steps.length - 1
          ? steps.slice(-2)
          : steps.slice(currentStep, currentStep + 2);
      default:
        return steps.slice(currentStep, currentStep + 1);
    }
  };

  const stepsToShow = getVisibleSteps();
  const showEllipsis = steps.length > stepsToShow.length;

  return (
    <div ref={containerRef} className="flex items-center overflow-hidden">
      {(currentStep === steps.length - 1 && stepsToShow.length - 1 != steps.length - 1) && (
        <div className="flex items-center">
          <MoreHorizontal size={textSize + 4} color={textColor} style={{display: 'flex', marginTop: '8px'}} />
          <ChevronRight size={textSize + 4} color={textColor} style={{marginRight: gap, marginLeft:gap}} />
        </div>
      )}
      {stepsToShow.map((step,index) => (
        <React.Fragment key={index}>
          <div className='flex items-center'>
            <div className={`flex justify-center items-center rounded-full ${steps.indexOf(step) < currentStep || steps.indexOf(step) > currentStep ? "border border-solid" : ""}`}
                 style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: steps.indexOf(step) < currentStep || steps.indexOf(step) > currentStep ? bgColor : primaryColor,
                    borderColor: steps.indexOf(step) < currentStep ? primaryColor : steps.indexOf(step) === currentStep ? "" : nextStepsBorderColor,
                 }}
            >
              {steps.indexOf(step) < currentStep ? 
                <Icon size={textSize} color={primaryColor} /> : steps.indexOf(step) === currentStep ? 
                <p className='font-medium' style={{color: textColorInStep, fontSize: textSize}}>{steps.indexOf(step) + 1}</p> : 
                <p style={{color: nextStepsStepColor, fontSize: textSize}}>{steps.indexOf(step) + 1}</p>}
            </div>
            <p style={{ color: textColor, fontSize: textSize, marginLeft: spacing}}>{step}</p>
          </div>
          {index < stepsToShow.length - 1 && (
            <div className="flex">
              <ChevronRight size={textSize + 4} color={textColor} style={{marginRight: gap, marginLeft: gap}}/>
            </div>
          )}
        </React.Fragment>
      ))}
      {showEllipsis && stepsToShow[stepsToShow.length - 1] != steps[steps.length - 1] && (
        <div className="flex items-center">
          <ChevronRight size={textSize + 4} color={textColor} style={{marginRight: gap, marginLeft:gap}} />
          <MoreHorizontal size={textSize + 4} color={textColor} style={{display: 'flex', marginTop: '8px'}} />
        </div>
      )}
    </div>
  );
}

export default Stepper;