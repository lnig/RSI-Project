type LabelProps = {
  fontSize?: number,
  fontColor?: string
  text?: string,
  weight?: number
}

const Label: React.FC<LabelProps> = ({
  fontSize = 14,
  fontColor = '#313642',
  text = "ssss", 
  weight = 400
}) => {

  return (
    <p style={{fontSize: fontSize, color: fontColor, fontWeight: weight}}>{text}</p>
  )
}

export default Label;