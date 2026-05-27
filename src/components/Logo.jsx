const LOGO_URL = 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1779034345/logonoborder.png'

export default function Logo({ className = 'h-8', src = LOGO_URL }) {
  return (
    <img
      src={src}
      alt="DIKË"
      className={`object-contain ${className}`}
    />
  )
}
