
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ArrowRight } from 'lucide-react';

interface CompanyFormProps {
  onSubmit: (companyName: string) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onSubmit(companyName.trim());
      setCompanyName('');
    }
  };

  return (
    <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Informações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName" className="text-[#0E4A36] font-medium">
              Nome da Empresa
            </Label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: A. V. B. Pinheiro Refeições"
              className="mt-2 border-[#AAD1C2] focus:border-[#117A57] focus:ring-[#117A57]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#117A57] hover:bg-[#0E4A36] text-white"
            disabled={!companyName.trim()}
          >
            Gerar Credenciais
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
