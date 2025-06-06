
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Key } from 'lucide-react';

const WelcomeCard: React.FC = () => {
  return (
    <Card className="border-[#AAD1C2] shadow-lg h-fit">
      <CardContent className="p-8 text-center">
        <div className="bg-[#AAD1C2]/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Key className="w-10 h-10 text-[#117A57]" />
        </div>
        <h3 className="text-xl font-semibold text-[#0E4A36] mb-2">
          Aguardando Empresa
        </h3>
        <p className="text-[#333333]">
          Digite o nome de uma empresa para gerar as credenciais automaticamente.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
