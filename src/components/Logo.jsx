const LOGO_URL = 'https://res.cloudinary.com/dhhxrrgut/image/upload/v1779034345/logonoborder.png'

export default function Logo({ className = 'h-8' }) {
  return (
    <img
      src={LOGO_URL}
      alt="DIKË"
      className={`object-contain ${className}`}
    />
  )
}
