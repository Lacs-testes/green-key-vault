
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebhookConfig = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('webhookUrl');
    if (saved) {
      setWebhookUrl(saved);
      setIsConfigured(true);
    }
  }, []);

  const handleSave = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(webhookUrl); // Valida se é uma URL válida
      localStorage.setItem('webhookUrl', webhookUrl);
      setIsConfigured(true);
      setShowConfig(false);
      toast({
        title: "Configurado",
        description: "Webhook configurado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "URL inválida. Verifique e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('webhookUrl');
    setWebhookUrl('');
    setIsConfigured(false);
    setShowConfig(false);
    toast({
      title: "Removido",
      description: "Configuração do webhook removida.",
    });
  };

  if (!showConfig && isConfigured) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Check className="w-4 h-4" />
        <span>Planilha conectada</span>
        <Button
          onClick={() => setShowConfig(true)}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-[#AAD1C2] shadow-lg">
      <CardHeader className="bg-[#117A57] text-white">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          Configurar Planilha
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhookUrl" className="text-xs">
            URL do Webhook (Make ou N8N)
          </Label>
          <Input
            id="webhookUrl"
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hook.make.com/..."
            className="text-xs"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-[#117A57] hover:bg-[#0E4A36] text-white flex-1"
          >
            Salvar
          </Button>
          {isConfigured && (
            <Button
              onClick={handleRemove}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Remover
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p>Como configurar:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Crie um cenário no Make ou N8N</li>
            <li>Adicione um webhook como trigger</li>
            <li>Configure para enviar dados para Google Sheets</li>
            <li>Cole a URL do webhook aqui</li>
          </ol>
          <a 
            href="https://www.make.com/en/integrations/google-sheets" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#117A57] hover:underline"
          >
            Ver tutorial Make + Google Sheets
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
