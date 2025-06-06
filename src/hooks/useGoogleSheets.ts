
import { useState, useCallback } from 'react';
import { googleSheetsService } from '@/services/googleSheetsService';
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

  const loadRecords = useCallback(async (): Promise<CompanyRecord[]> => {
    setIsLoading(true);
    try {
      const records = await googleSheetsService.getAllRecords();
      const sortedRecords = records.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sortedRecords;
    } catch (error) {
      console.error('Erro ao carregar histórico do Google Sheets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico do Google Sheets. Usando dados locais.",
        variant: "destructive",
      });
      return getLocalHistory();
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveRecord = useCallback(async (record: CompanyRecord): Promise<CompanyRecord> => {
    if (googleSheetsService.isConfigured()) {
      try {
        await googleSheetsService.addRecord(record);
        toast({
          title: "Salvo",
          description: "Dados salvos no Google Sheets com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao salvar no Google Sheets:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar no Google Sheets. Dados salvos localmente.",
          variant: "destructive",
        });
        saveToLocalStorage(record);
      }
    } else {
      saveToLocalStorage(record);
    }
    
    return record;
  }, [toast]);

  const deleteRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await googleSheetsService.deleteRecord(id);
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
      await googleSheetsService.updateRecord(recordWithUpdateTime);
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
