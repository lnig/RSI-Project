type SeparatorProps = {
  width?: string,
  height?: number,
  color?: string,
  padding?: number
  rounded?: boolean
}

const Separator: React.FC<SeparatorProps> = ({
  width = 'w-full',
  height = 1,
  color = '#EB4C60',
  padding = 0,
  rounded = true
}) => {

  return (
    <div 
      className={`${width} ${rounded && 'rounded-full'}`}
      style={{height: `${height}px`, background: color, paddingLeft: padding, paddingRight: padding}}  
    >
    </div>
  )
}

export default Separator;