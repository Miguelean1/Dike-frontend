import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-800 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">DIKË</h1>
        <p className="text-lg text-gray-700 mb-10">
          Bienvenido! Plataforma de donaciones y préstamos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-10 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-semibold"
          >
            Entrar
          </Link>
          <Link
            to="/feed"
            className="px-10 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white font-semibold"
          >
            Continuar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
