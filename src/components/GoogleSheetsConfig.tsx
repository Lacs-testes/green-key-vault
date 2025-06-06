import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { googleSheetsService, GoogleSheetsService } from '@/services/googleSheetsService'; // ✅ importa a classe e instância

const service: GoogleSheetsService = googleSheetsService; // ✅ define instância tipada

interface GoogleSheetsConfigProps {
  onConfigChange: (configured: boolean) => void;
}

const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({ onConfigChange }) => {
  const [webAppUrl, setWebAppUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const configured = service.isConfigured();
    setIsConfigured(configured);
    onConfigChange(configured);

    if (configured) {
      setWebAppUrl(localStorage.getItem('google_apps_script_url') || '');
    }
  }, [onConfigChange]);

  const validateAndSave = async () => {
    if (!webAppUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do Google Apps Script.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      service.setWebAppUrl(webAppUrl.trim());
      await service.getAllRecords();

      setIsConfigured(true);
      onConfigChange(true);

      toast({
        title: "Sucesso",
        description: "Conexão com Google Sheets configurada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao validar configuração:', error);
      toast({
        title: "Erro de conexão",
        description: error instanceof Error ? error.message : "Não foi possível conectar com o Google Apps Script. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('google_apps_script_url');
    setWebAppUrl('');
    setIsConfigured(false);
    onConfigChange(false);

    toast({
      title: "Desconectado",
      description: "Google Sheets desconectado. Os dados serão salvos localmente.",
    });
  };

  const openInstructions = () => {
    window.open('https://script.google.com', '_blank');
  };

  const maskUrl = (url: string) => {
    if (!url) return '';
    const urlParts = url.split('/');
    if (urlParts.length < 6) return url;
    const scriptId = urlParts[5];
    if (scriptId.length > 8) {
      return `...${scriptId.slice(-8)}/exec`;
    }
    return url;
  };

  return (
    <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração Google Sheets
          {isConfigured && <CheckCircle2 className="w-5 h-5 text-green-200" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isConfigured ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Conectado ao Google Sheets</span>
            </div>
            <div className="text-sm text-[#333333]">
              <strong>URL configurada:</strong>
              <div className="font-mono text-xs bg-[#AAD1C2]/20 p-2 rounded mt-1">
                {maskUrl(webAppUrl)}
              </div>
            </div>
            <Button
              onClick={disconnect}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
            >
              Desconectar Google Sheets
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Google Sheets não configurado.</strong>
                <br />
                Configure para sincronizar automaticamente os dados.
              </div>
            </div>

            <div>
              <Label htmlFor="webAppUrl" className="text-[#0E4A36] font-medium">
                URL do Google Apps Script Web App
              </Label>
              <Input
                id="webAppUrl"
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="mt-2 border-[#AAD1C2] focus:border-[#117A57]"
              />
              <p className="text-xs text-[#333333] mt-1">
                Cole aqui a URL do Web App do seu Google Apps Script
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={validateAndSave}
                disabled={isValidating}
                className="flex-1 bg-[#117A57] hover:bg-[#0E4A36] text-white"
              >
                {isValidating ? 'Validando...' : 'Conectar'}
              </Button>
              <Button
                onClick={openInstructions}
                variant="outline"
                className="border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-[#333333] bg-[#AAD1C2]/10 p-3 rounded">
              <strong>Como configurar:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Crie uma nova planilha no Google Sheets</li>
                <li>Abra o Google Apps Script (script.google.com)</li>
                <li>Cole o código do Apps Script fornecido</li>
                <li>Publique como Web App com acesso "Qualquer pessoa"</li>
                <li>Cole a URL aqui</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
