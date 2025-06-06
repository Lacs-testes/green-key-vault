
import { useState, useEffect, useCallback } from 'react';
import { CompanyRecord } from '@/types/company';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { generateCredentials } from '@/utils/credentialGenerator';
import { useToast } from '@/hooks/use-toast';

export const useCompanyRecords = () => {
  const [currentRecord, setCurrentRecord] = useState<CompanyRecord | null>(null);
  const [history, setHistory] = useState<CompanyRecord[]>([]);
  const { toast } = useToast();
  const googleSheets = useGoogleSheets();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    const records = await googleSheets.loadRecords();
    setHistory(records);
  }, [googleSheets]);

  const searchInHistory = useCallback((companyName: string): CompanyRecord | null => {
    return history.find(record => 
      record.companyName.toLowerCase() === companyName.toLowerCase()
    ) || null;
  }, [history]);

  const handleCompanySubmit = useCallback(async (companyName: string) => {
    const existingRecord = searchInHistory(companyName);
    
    if (existingRecord) {
      setCurrentRecord(existingRecord);
      toast({
        title: "Encontrado no histórico",
        description: "Credenciais recuperadas do histórico.",
      });
    } else {
      const { username, password } = generateCredentials(companyName);
      const newRecord: CompanyRecord = {
        id: Date.now().toString(),
        companyName,
        username,
        password,
        createdAt: new Date().toISOString()
      };
      
      await googleSheets.saveRecord(newRecord);
      await loadHistory();
      setCurrentRecord(newRecord);
      toast({
        title: "Credenciais geradas",
        description: "Novas credenciais foram criadas e salvas.",
      });
    }
  }, [searchInHistory, googleSheets, loadHistory, toast]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await googleSheets.deleteRecord(id);
      await loadHistory();
      
      if (currentRecord && currentRecord.id === id) {
        setCurrentRecord(null);
      }
    } catch (error) {
      // Error already handled in useGoogleSheets hook
    }
  }, [googleSheets, loadHistory, currentRecord]);

  const handleUpdate = useCallback(async (updatedRecord: CompanyRecord) => {
    try {
      const updated = await googleSheets.updateRecord(updatedRecord);
      await loadHistory();
      
      if (currentRecord && currentRecord.id === updatedRecord.id) {
        setCurrentRecord(updated);
      }
    } catch (error) {
      // Error already handled in useGoogleSheets hook
    }
  }, [googleSheets, loadHistory, currentRecord]);

  const handleHistorySelect = useCallback((record: CompanyRecord) => {
    setCurrentRecord(record);
  }, []);

  return {
    currentRecord,
    history,
    isLoading: googleSheets.isLoading,
    handleCompanySubmit,
    handleDelete,
    handleUpdate,
    handleHistorySelect
  };
};
