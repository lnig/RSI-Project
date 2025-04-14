type TagProps = {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl',
  text: string,
  foreground?: string,
  background?: string,
  Icon: React.ElementType
}

const Tag: React.FC<TagProps> = ({
  size = 'm',
  text,
  Icon,
  foreground = '#313642',
  background = '#F2F3F4'
}) => {

  const sizeClasses: Record<NonNullable<TagProps['size']>, string> = {
    xs: 'px-3 py-1 text-xs h-7',
    s: 'px-3 py-1 text-sm h-8',
    m: 'px-3 py-1 text-base h-9',
    l: 'px-4 py-1 text-lg h-10',
    xl: 'px-4 py-2 text-lg h-11',
  };

  return (
    <div className={`w-fit flex items-center justify-center gap-[6px]  rounded-full ${sizeClasses[size]} `}
      style={{background: background, color: foreground }}
    >
      <Icon
        size={size === 'xs' ? 14 : size === 's' ? 16 : size === 'm' ? 18 : size === 'l' ? 20 : 22} 
        color={foreground} 
        strokeWidth={2} 
      />
      <p className="font-medium">{text}</p>
    </div>
  );
}

export default Tag;