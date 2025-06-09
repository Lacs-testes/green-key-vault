
import { useState, useCallback } from 'react';
import { CompanyRecord } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

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
    const webhookUrl = localStorage.getItem('webhookUrl');
    
    if (!webhookUrl) {
      console.log('Webhook URL não configurada, salvando apenas localmente');
      return;
    }

    try {
      const payload = {
        action,
        record,
        timestamp: new Date().toISOString(),
        source: 'credential-generator'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Dados enviados para webhook com sucesso');
        toast({
          title: "Sincronizado",
          description: "Dados enviados para a planilha com sucesso!",
        });
      } else {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao enviar para webhook:', error);
      toast({
        title: "Aviso",
        description: "Dados salvos localmente. Verifique a conexão com a planilha.",
        variant: "destructive",
      });
    }
  };

  const loadRecords = useCallback(async (): Promise<CompanyRecord[]> => {
    setIsLoading(true);
    try {
      // Sempre carrega do localStorage
      const records = getLocalHistory();
      return records;
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRecord = useCallback(async (record: CompanyRecord): Promise<CompanyRecord> => {
    // Salva localmente primeiro
    saveToLocalStorage(record);
    
    // Tenta enviar para webhook
    await sendToWebhook(record, 'create');
    
    return record;
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<void> => {
    try {
      // Remove do localStorage
      const localHistory = getLocalHistory();
      const updatedHistory = localHistory.filter(record => record.id !== id);
      localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
      
      // Encontra o registro para enviar ao webhook
      const recordToDelete = localHistory.find(record => record.id === id);
      if (recordToDelete) {
        await sendToWebhook(recordToDelete, 'delete');
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
  }, []);

  const updateRecord = useCallback(async (updatedRecord: CompanyRecord): Promise<CompanyRecord> => {
    const recordWithUpdateTime = {
      ...updatedRecord,
      updatedAt: new Date().toISOString()
    };

    try {
      // Atualiza no localStorage
      const localHistory = getLocalHistory();
      const updatedHistory = localHistory.map(record => 
        record.id === recordWithUpdateTime.id ? recordWithUpdateTime : record
      );
      localStorage.setItem('companyHistory', JSON.stringify(updatedHistory));
      
      // Envia para webhook
      await sendToWebhook(recordWithUpdateTime, 'update');
      
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
  }, []);

  return {
    isLoading,
    loadRecords,
    saveRecord,
    deleteRecord,
    updateRecord,
    getLocalHistory
  };
};
