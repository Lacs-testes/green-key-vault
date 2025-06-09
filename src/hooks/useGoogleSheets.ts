
import { useState, useCallback } from 'react';
import { CompanyRecord } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

// URL do webhook do Make/N8N - substitua pela sua URL real
const WEBHOOK_URL = 'https://hook.eu2.make.com/SEU_WEBHOOK_AQUI';

export const useGoogleSheets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getLocalHistory = (): CompanyRecord[] => {
    const stored = localStorage.getItem('companyHistory');
    return stored ? JSON.parse(stored) : [];
  };

  const saveToLocalStorage = (record: CompanyRecord) => {
    const localHistory = getLocalHistory();
    const updatedHistory = [record, ...localHistory];
    localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
    return updatedHistory;
  };

  const sendToWebhook = async (record: CompanyRecord, action: 'create' | 'update' | 'delete') => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          record,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      console.log(`Webhook enviado com sucesso para ${action}:`, record);
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      // Não vamos mostrar erro para o usuário, apenas loggar
    }
  };

  const loadRecords = useCallback(async (): Promise<CompanyRecord[]> => {
    setIsLoading(true);
    try {
      // Simula um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      return getLocalHistory();
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRecord = useCallback(async (record: CompanyRecord): Promise<CompanyRecord> => {
    saveToLocalStorage(record);
    
    // Enviar para webhook em background
    sendToWebhook(record, 'create');
    
    toast({
      title: "Salvo",
      description: "Credenciais salvas e enviadas para a planilha.",
    });
    return record;
  }, [toast]);

  const deleteRecord = useCallback(async (id: string): Promise<void> => {
    try {
      const localHistory = getLocalHistory();
      const recordToDelete = localHistory.find(record => record.id === id);
      const updatedHistory = localHistory.filter(record => record.id !== id);
      localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
      
      // Enviar para webhook em background
      if (recordToDelete) {
        sendToWebhook(recordToDelete, 'delete');
      }
      
      toast({
        title: "Excluído",
        description: "Registro removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir registro.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateRecord = useCallback(async (updatedRecord: CompanyRecord): Promise<CompanyRecord> => {
    const recordWithUpdateTime = {
      ...updatedRecord,
      updatedAt: new Date().toISOString()
    };

    try {
      const localHistory = getLocalHistory();
      const updatedHistory = localHistory.map(record => 
        record.id === recordWithUpdateTime.id ? recordWithUpdateTime : record
      );
      localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
      
      // Enviar para webhook em background
      sendToWebhook(recordWithUpdateTime, 'update');
      
      toast({
        title: "Atualizado",
        description: "Registro atualizado com sucesso.",
      });
      return recordWithUpdateTime;
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar registro.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    isLoading,
    loadRecords,
    saveRecord,
    deleteRecord,
    updateRecord,
    getLocalHistory
  };
};
