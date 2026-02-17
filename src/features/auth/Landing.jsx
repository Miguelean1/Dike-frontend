import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <img src="https://res.cloudinary.com/dhhxrrgut/image/upload/v1771345261/logoDef1_fwjpip.png" alt="logo" className="w-2 h-2"/>
      <div className="w-32 h-32 bg-red-500 rounded-full mb-8 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">DIKE</span>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-2">
        Bienvenido a DIKE!!
      </h1>
      
      <p className="text-gray-600 text-center mb-8 max-w-sm">
        Dona, presta y encuentra de todo!
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <Button fullWidth onClick={() => navigate('/login')}>
          Iniciar sesión
        </Button>
        <Button variant="outline" fullWidth onClick={() => navigate('/register')}>
          Registrarse
        </Button>
      </div>
    </div>
  );
}
