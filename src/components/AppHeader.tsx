
import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-8">
      <div className="w-[150px] h-[60px] mr-6 flex items-center">
        <img 
          src="/lovable-uploads/97b4ddf8-3252-4cff-9f32-4895d75ca399.png" 
          alt="LAES Logo" 
          className="h-full w-auto object-contain"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#0E4A36] mb-2">
          Gerador de Credenciais
        </h1>
        <p className="text-[#333333] text-lg">
          Sistema de geração de usuário e senha para empresas
        </p>
      </div>
    </div>
  );
};

export default AppHeader;
