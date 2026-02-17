import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Conectar con backend
    console.log('Login:', formData);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2">Accede</h2>
        <p className="text-gray-600 mb-8">Inicia sesión en tu cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-black font-semibold hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
