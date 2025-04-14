import { User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

type AvatarProps = {
  src?: string,             // link to image
  alt?: string,             // alt text for image
  size: number,             // size of avatar
  linkTo?: string,          // link to user profile
  staticAvatar?: boolean,   // if the avatar is static (not image, only color and icon)
  bgColor?: string,         // background color of avatar
  plusNumber?: number,      // number of users to display
  icon?: boolean,           // if the avatar has icon
  iconColor?: string,       // color of icon in avatar
  border?: boolean,         // if the avatar has border
  borderColor?: string,     // color of border
  roundedSize?: number      // size of rounded border
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 32,
  linkTo,
  staticAvatar = false,
  bgColor = '#EB4C60',
  plusNumber,
  icon = false,
  iconColor = '#FFFFFF',
  border = false,
  borderColor = '#FFF',
  roundedSize = 999
}) => {
  
  if (size < 32) size = 32;
  if (plusNumber != null && plusNumber < 2) return;

  return (
    <Link to={linkTo || '#'}>
      <div 
        className={`overflow-hidden`}
        style={{
            width: `${size}px`, 
            height: `${size}px`,
            border: border ? `1px solid ${borderColor}` : 'none',
            borderRadius: roundedSize
        }}
      >
        {staticAvatar ? (
          <div
            className='w-full h-full flex items-center justify-center'
            style={{ background: bgColor }}
          > 
            {icon ? (
              <User size={size * 0.5} color={iconColor} />
            ) : (
              <p className='text-white text-sm font-semibold -ml-[2px]'>{`+${plusNumber}`}</p>
            )}
          </div>
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <img src={src} alt={alt}/>
          </div>
        )}
      </div>
    </Link>
    )
}

export default Avatar;