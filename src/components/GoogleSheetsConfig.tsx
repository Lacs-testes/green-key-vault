
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleSheetsService } from '@/services/googleSheetsService';

interface GoogleSheetsConfigProps {
  onConfigChange: (isConfigured: boolean) => void;
}

const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({ onConfigChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [isConfigured, setIsConfigured] = useState(googleSheetsService.isConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!apiKey.trim() || !spreadsheetId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      googleSheetsService.setCredentials(apiKey.trim(), spreadsheetId.trim());
      
      // Tentar inicializar a planilha
      await googleSheetsService.initializeSheet();
      
      setIsConfigured(true);
      onConfigChange(true);
      
      toast({
        title: "Configuração salva",
        description: "Integração com Google Sheets configurada com sucesso!",
      });
      
      // Limpar os campos
      setApiKey('');
      setSpreadsheetId('');
    } catch (error) {
      toast({
        title: "Erro na configuração",
        description: "Verifique as credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_sheets_api_key');
    localStorage.removeItem('google_sheets_id');
    setIsConfigured(false);
    onConfigChange(false);
    
    toast({
      title: "Desconectado",
      description: "Integração com Google Sheets removida.",
    });
  };

  if (isConfigured) {
    return (
      <Card className="border-[#AAD1C2] shadow-lg">
        <CardHeader className="bg-[#117A57] text-white">
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Google Sheets Conectado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[#333333]">
              Dados sendo sincronizados com Google Sheets
            </p>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurar Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Como configurar:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Acesse o Google Cloud Console</li>
                <li>Ative a API do Google Sheets</li>
                <li>Crie uma API Key</li>
                <li>Crie uma planilha no Google Sheets</li>
                <li>Copie o ID da planilha da URL</li>
              </ol>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="apiKey" className="text-[#0E4A36] font-medium">
            API Key do Google
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="mt-2 border-[#AAD1C2] focus:border-[#117A57]"
          />
        </div>

        <div>
          <Label htmlFor="spreadsheetId" className="text-[#0E4A36] font-medium">
            ID da Planilha
          </Label>
          <Input
            id="spreadsheetId"
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            className="mt-2 border-[#AAD1C2] focus:border-[#117A57]"
          />
          <p className="text-xs text-[#333333] mt-1">
            Copie da URL: docs.google.com/spreadsheets/d/<strong>ID_AQUI</strong>/edit
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#117A57] hover:bg-[#0E4A36] text-white"
        >
          {isLoading ? 'Configurando...' : 'Salvar Configuração'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
