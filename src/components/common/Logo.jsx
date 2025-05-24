import LogoImage from '../../assets/images/logo2.png'

function Logo({ className }) {
  return (
    <div className={`text-primary-500 ${className} `}>
      <img src={LogoImage} alt="Logo" className="h-full w-full" />
    </div>
  )
}

export default Logo