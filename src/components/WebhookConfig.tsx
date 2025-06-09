
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfigProps {
  onConfigChange: (configured: boolean) => void;
}

const WebhookConfig: React.FC<WebhookConfigProps> = ({ onConfigChange }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('webhook_url');
    if (stored) {
      setWebhookUrl(stored);
      setIsConfigured(true);
      onConfigChange(true);
    }
  }, [onConfigChange]);

  const validateAndSave = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      // Testar o webhook
      const response = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      localStorage.setItem('webhook_url', webhookUrl.trim());
      setIsConfigured(true);
      onConfigChange(true);

      toast({
        title: "Sucesso",
        description: "Webhook configurado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao validar webhook:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar com o webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('webhook_url');
    setWebhookUrl('');
    setIsConfigured(false);
    onConfigChange(false);

    toast({
      title: "Desconectado",
      description: "Webhook desconectado. Os dados serão salvos apenas localmente.",
    });
  };

  const openMakeInstructions = () => {
    window.open('https://www.make.com/en/help/scenarios/webhooks', '_blank');
  };

  const maskUrl = (url: string) => {
    if (!url) return '';
    const urlParts = url.split('/');
    if (urlParts.length > 3) {
      return `${urlParts[0]}//${urlParts[2]}/.../${urlParts[urlParts.length - 1]}`;
    }
    return url;
  };

  return (
    <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração Make/N8N
          {isConfigured && <CheckCircle2 className="w-5 h-5 text-green-200" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isConfigured ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Conectado ao Make/N8N</span>
            </div>
            <div className="text-sm text-[#333333]">
              <strong>Webhook configurado:</strong>
              <div className="font-mono text-xs bg-[#AAD1C2]/20 p-2 rounded mt-1">
                {maskUrl(webhookUrl)}
              </div>
            </div>
            <Button
              onClick={disconnect}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50"
            >
              Desconectar Webhook
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Webhook não configurado.</strong>
                <br />
                Configure para enviar dados automaticamente para a planilha.
              </div>
            </div>

            <div>
              <Label htmlFor="webhookUrl" className="text-[#0E4A36] font-medium">
                URL do Webhook (Make/N8N)
              </Label>
              <Input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hook.eu2.make.com/..."
                className="mt-2 border-[#AAD1C2] focus:border-[#117A57]"
              />
              <p className="text-xs text-[#333333] mt-1">
                Cole aqui a URL do webhook do seu cenário Make ou N8N
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={validateAndSave}
                disabled={isValidating}
                className="flex-1 bg-[#117A57] hover:bg-[#0E4A36] text-white"
              >
                {isValidating ? 'Testando...' : 'Conectar'}
              </Button>
              <Button
                onClick={openMakeInstructions}
                variant="outline"
                className="border-[#117A57] text-[#117A57] hover:bg-[#AAD1C2]/20"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-[#333333] bg-[#AAD1C2]/10 p-3 rounded">
              <strong>Como configurar:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Crie um novo cenário no Make ou N8N</li>
                <li>Adicione um módulo Webhook como trigger</li>
                <li>Configure para receber dados JSON</li>
                <li>Conecte com Google Sheets ou outra planilha</li>
                <li>Cole a URL do webhook aqui</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
