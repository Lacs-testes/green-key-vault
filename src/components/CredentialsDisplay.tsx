
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, User, Lock, Building2, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyRecord {
  id: string;
  companyName: string;
  username: string;
  password: string;
  createdAt: string;
  userModel: 1 | 2;
}

interface CredentialsDisplayProps {
  record: CompanyRecord;
}

const CredentialsDisplay: React.FC<CredentialsDisplayProps> = ({ record }) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast({
        title: "Copiado!",
        description: `${fieldName} copiado para a área de transferência.`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Card className="border-[#117A57] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Credenciais Geradas
          <div className="ml-auto flex items-center gap-1 text-sm">
            <Badge className="w-4 h-4" />
            Modelo {record.userModel}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Empresa */}
        <div>
          <Label className="text-[#0E4A36] font-medium flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4" />
            Empresa
          </Label>
          <Input
            value={record.companyName}
            readOnly
            className="bg-[#AAD1C2]/10 border-[#AAD1C2] font-medium"
          />
        </div>

        {/* Usuário */}
        <div>
          <Label className="text-[#0E4A36] font-medium flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Nome de Usuário
          </Label>
          <div className="flex gap-2">
            <Input
              value={record.username}
              readOnly
              className="bg-[#AAD1C2]/10 border-[#AAD1C2] font-mono text-lg"
            />
            <Button
              onClick={() => copyToClipboard(record.username, 'Usuário')}
              variant="outline"
              size="icon"
              className="border-[#117A57] text-[#117A57] hover:bg-[#117A57] hover:text-white"
            >
              {copiedField === 'Usuário' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Senha */}
        <div>
          <Label className="text-[#0E4A36] font-medium flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            Senha
          </Label>
          <div className="flex gap-2">
            <Input
              value={record.password}
              readOnly
              className="bg-[#AAD1C2]/10 border-[#AAD1C2] font-mono text-lg"
            />
            <Button
              onClick={() => copyToClipboard(record.password, 'Senha')}
              variant="outline"
              size="icon"
              className="border-[#117A57] text-[#117A57] hover:bg-[#117A57] hover:text-white"
            >
              {copiedField === 'Senha' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Copiar Ambos */}
        <Button
          onClick={() => copyToClipboard(`Usuário: ${record.username}\nSenha: ${record.password}`, 'Credenciais')}
          className="w-full bg-[#0E4A36] hover:bg-[#117A57] text-white"
        >
          {copiedField === 'Credenciais' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Credenciais Copiadas!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Usuário e Senha
            </>
          )}
        </Button>

        {/* Info da Data */}
        <div className="text-sm text-[#333333] text-center pt-4 border-t border-[#AAD1C2]">
          Gerado em: {formatDate(record.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialsDisplay;
